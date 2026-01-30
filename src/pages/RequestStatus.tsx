import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Check, FileDown } from 'lucide-react';
import { mockReportRequests } from '@/data/mockData';

const RequestStatus: React.FC = () => {
  const generatedReports = mockReportRequests.filter(r => r.status === 'Completed');
  const ongoingReports = mockReportRequests.filter(r => r.status === 'Processing' || r.status === 'Requested');
  const failedReports = mockReportRequests.filter(r => r.status === 'Failed');

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-primary">Report Request Status</h1>

        {/* Generated Reports */}
        <section>
          <h2 className="text-sm font-medium mb-4">Generated Reports</h2>
          <div className="space-y-4">
            {generatedReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Check className="h-5 w-5 text-success mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-success">[SUCCESS] Report Generated</p>
                        <p className="text-xs text-muted-foreground">Requested On: {report.requestedOn}</p>
                        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded mt-2">
                          {report.description}
                        </p>
                        <Button size="sm" className="mt-2 h-7 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Reports
                        </Button>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{report.requestedOn}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {generatedReports.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileDown className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No generated reports</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Ongoing Reports */}
        <section>
          <h2 className="text-sm font-medium mb-4">Ongoing Reports</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <FileDown className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Currently there is no ongoing request</p>
            </CardContent>
          </Card>
        </section>

        {/* Failed Reports */}
        <section>
          <h2 className="text-sm font-medium mb-4">Failed Reports</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <FileDown className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No failed request</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default RequestStatus;
