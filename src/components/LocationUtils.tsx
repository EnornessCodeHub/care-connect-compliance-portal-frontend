import { Geolocation } from '@capacitor/geolocation';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export class LocationService {
  private static watchId: string | number | null = null;

  static async requestPermissions(): Promise<boolean> {
    try {
      // Try Capacitor first (for mobile)
      const permission = await Geolocation.requestPermissions();
      return permission.location === 'granted';
    } catch (error) {
      // Fallback to web geolocation API
      if (navigator.geolocation) {
        return new Promise((resolve) => {
          navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            resolve(result.state === 'granted' || result.state === 'prompt');
          }).catch(() => {
            resolve(true); // Assume permission if we can't check
          });
        });
      }
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationData | null> {
    try {
      // Try Capacitor first (for mobile)
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
    } catch (error) {
      // Fallback to web geolocation API
      if (navigator.geolocation) {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            (error) => {
              console.error('Web geolocation error:', error);
              resolve(null);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }
          );
        });
      }
      return null;
    }
  }

  static async startWatching(
    callback: (location: LocationData) => void,
    errorCallback?: (error: any) => void
  ): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      try {
        // Try Capacitor first (for mobile)
        this.watchId = await Geolocation.watchPosition({
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 30000
        }, (position) => {
          if (position) {
            callback({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          }
        });
      } catch (capacitorError) {
        // Fallback to web geolocation API
        if (navigator.geolocation) {
          this.watchId = navigator.geolocation.watchPosition(
            (position) => {
              callback({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            (error) => {
              console.error('Web geolocation watch error:', error);
              if (errorCallback) {
                errorCallback(error);
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 30000
            }
          );
        } else {
          throw new Error('Geolocation not supported');
        }
      }
    } catch (error) {
      console.error('Error starting location watch:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }

  static async stopWatching(): Promise<void> {
    if (this.watchId) {
      try {
        if (typeof this.watchId === 'string') {
          // Capacitor watch ID
          await Geolocation.clearWatch({ id: this.watchId });
        } else {
          // Web API watch ID
          navigator.geolocation.clearWatch(this.watchId);
        }
        this.watchId = null;
      } catch (error) {
        console.error('Error stopping location watch:', error);
      }
    }
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  }

  private static degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static formatCoordinates(lat: number, lng: number): string {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  static openInMaps(lat: number, lng: number, label?: string): void {
    const query = label ? `${lat},${lng}(${encodeURIComponent(label)})` : `${lat},${lng}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  }

  static generateMapStaticUrl(
    lat: number, 
    lng: number, 
    zoom: number = 15, 
    width: number = 300, 
    height: number = 200
  ): string {
    // Using a basic static map URL - in production you might want to use Google Maps Static API
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.005},${lat-0.005},${lng+0.005},${lat+0.005}&layer=mapnik&marker=${lat},${lng}`;
  }
}