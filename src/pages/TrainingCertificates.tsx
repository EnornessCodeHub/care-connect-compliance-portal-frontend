import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserCertificates, Certificate } from '@/lib/utils';
import authService from '@/services/authService';
import { Award, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const TrainingCertificates = () => {
  const user = authService.getUserData();
  const userId = user ? String(user.id) : '';
  
  const certificates = useMemo(() => {
    if (!userId) return [];
    return getUserCertificates(userId);
  }, [userId]);

  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const handleDownload = (certificate: Certificate) => {
    // Create a simple certificate HTML for printing/downloading
    const certificateHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${certificate.courseName}</title>
          <style>
            @media print {
              body { margin: 0; }
            }
            body {
              font-family: 'Times New Roman', serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f5f5;
              margin: 20px;
            }
            .certificate {
              width: 800px;
              height: 600px;
              border: 20px solid #d4af37;
              background: white;
              padding: 60px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              position: relative;
              text-align: center;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              bottom: 20px;
              border: 2px solid #d4af37;
            }
            h1 {
              font-size: 48px;
              color: #1a1a1a;
              margin-bottom: 20px;
              letter-spacing: 4px;
            }
            .subtitle {
              font-size: 24px;
              color: #666;
              margin-bottom: 40px;
            }
            .award-text {
              font-size: 18px;
              color: #333;
              margin: 30px 0;
              line-height: 1.8;
            }
            .name {
              font-size: 36px;
              font-weight: bold;
              color: #1a1a1a;
              margin: 20px 0;
              border-bottom: 2px solid #d4af37;
              padding-bottom: 10px;
              display: inline-block;
            }
            .course-name {
              font-size: 28px;
              color: #1a1a1a;
              margin: 20px 0;
            }
            .date {
              font-size: 16px;
              color: #666;
              margin-top: 40px;
            }
            .cert-number {
              font-size: 12px;
              color: #999;
              margin-top: 20px;
              position: absolute;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
            }
            .seal {
              font-size: 60px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <h1>CERTIFICATE</h1>
            <div class="subtitle">OF COMPLETION</div>
            <div class="award-text">
              This is to certify that
            </div>
            <div class="name">${certificate.userFullName}</div>
            <div class="award-text">
              has successfully completed the course
            </div>
            <div class="course-name">${certificate.courseName}</div>
            <div class="date">
              ${format(new Date(certificate.issuedAt), 'MMMM dd, yyyy')}
            </div>
            <div class="cert-number">
              Certificate Number: ${certificate.certificateNumber}
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(certificateHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-muted-foreground">Please log in to view your certificates.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and download your course completion certificates
          </p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Certificates Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Certificates will appear here once you complete courses with certificates enabled.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{certificate.courseName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Issued on {format(new Date(certificate.issuedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Certificate #: {certificate.certificateNumber}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedCertificate(certificate)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(certificate)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate View Dialog */}
      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCertificate && (
            <>
              <DialogHeader>
                <DialogTitle>Certificate of Completion</DialogTitle>
                <DialogDescription>
                  {selectedCertificate.courseName}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <CertificateView certificate={selectedCertificate} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Certificate Display Component
const CertificateView = ({ certificate }: { certificate: Certificate }) => {
  return (
    <div className="certificate-container bg-white border-8 border-yellow-400 p-12 max-w-3xl mx-auto shadow-2xl">
      <div className="text-center space-y-6 relative">
        {/* Decorative border */}
        <div className="absolute inset-4 border-2 border-yellow-400"></div>
        
        {/* Header */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-wider">
            CERTIFICATE
          </h1>
          <p className="text-2xl text-gray-600 mb-8">OF COMPLETION</p>
        </div>

        {/* Award Text */}
        <div className="relative z-10 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            This is to certify that
          </p>
          
          {/* Name */}
          <div className="my-6">
            <div className="text-4xl font-bold text-gray-900 border-b-4 border-yellow-400 pb-3 inline-block px-8">
              {certificate.userFullName}
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            has successfully completed the course
          </p>

          {/* Course Name */}
          <div className="my-6">
            <div className="text-3xl font-semibold text-gray-900">
              {certificate.courseName}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="relative z-10 mt-8">
          <p className="text-lg text-gray-600">
            {format(new Date(certificate.issuedAt), 'MMMM dd, yyyy')}
          </p>
        </div>

        {/* Certificate Number */}
        <div className="relative z-10 mt-8 pt-4 border-t border-gray-300">
          <p className="text-xs text-gray-500">
            Certificate Number: <span className="font-mono">{certificate.certificateNumber}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingCertificates;
