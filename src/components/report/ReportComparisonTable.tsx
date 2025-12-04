import React from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface ComparisonTableProps {
  headers: string[];
  rows: Record<string, string>[];
  title?: string;
}

const ReportComparisonTable: React.FC<ComparisonTableProps> = ({ headers, rows, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden">
        {title && (
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {headers.map((header, index) => (
                    <TableHead 
                      key={index} 
                      className={`font-bold whitespace-nowrap ${index === 0 ? 'sticky left-0 bg-muted/30 z-10' : ''}`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-muted/20">
                    {headers.map((header, cellIndex) => (
                      <TableCell 
                        key={cellIndex}
                        className={`${cellIndex === 0 ? 'font-medium sticky left-0 bg-background z-10' : ''} whitespace-nowrap`}
                      >
                        {row[header] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportComparisonTable;
