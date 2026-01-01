import React from 'react';
import { useTranslation } from 'react-i18next';

interface DataExportProps {
  data: Record<string, unknown>[];
  filename?: string;
  title?: string;
}

export const DataExport: React.FC<DataExportProps> = ({
  data,
  filename = 'killboard-data',
  title = 'Export Data',
}) => {
  useTranslation('components');

  const convertToCSV = (data: Record<string, unknown>[]): string => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map((row) => {
      return headers
        .map((header) => {
          const value = row[header];
          // Handle values that contain commas or quotes
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value ?? '');
        })
        .join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csv = convertToCSV(data);
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  };

  const exportToPDF = async () => {
    // Simple PDF generation using browser print functionality
    // In production, you might want to use a library like jsPDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0] || {})
                .map((key) => `<th>${key}</th>`)
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row) => `
              <tr>
                ${Object.values(row)
                  .map((value) => `<td>${value}</td>`)
                  .join('')}
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const copyToClipboard = async () => {
    try {
      const csv = convertToCSV(data);
      await navigator.clipboard.writeText(csv);
      // Show success message (you could implement a toast notification here)
      console.log('Data copied to clipboard');
    } catch (err) {
      console.error('Failed to copy data:', err);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-warning">
        <span>No data available to export</span>
      </div>
    );
  }

  return (
    <div className="data-export">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-base">{title}</h4>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={exportToCSV}
              title="Export as CSV file"
            >
              <i className="fas fa-file-csv" aria-hidden="true"></i>
              <span>CSV</span>
            </button>

            <button
              type="button"
              className="btn btn-info"
              onClick={exportToJSON}
              title="Export as JSON file"
            >
              <i className="fas fa-file-code" aria-hidden="true"></i>
              <span>JSON</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={exportToPDF}
              title="Export as PDF (opens print dialog)"
            >
              <i className="fas fa-file-pdf" aria-hidden="true"></i>
              <span>PDF</span>
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={copyToClipboard}
              title="Copy data to clipboard"
            >
              <i className="fas fa-copy" aria-hidden="true"></i>
              <span>Copy</span>
            </button>
          </div>

          <div className="text-base-content/60 text-xs">
            {data.length} records available for export
          </div>
        </div>
      </div>
    </div>
  );
};
