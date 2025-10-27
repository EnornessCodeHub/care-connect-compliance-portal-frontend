import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.52f5a42098c0432e8c9c5a307433674f',
  appName: 'clarity-control-center',
  webDir: 'dist',
  server: {
    url: 'https://52f5a420-98c0-432e-8c9c-5a307433674f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: ['location']
    }
  }
};

export default config;