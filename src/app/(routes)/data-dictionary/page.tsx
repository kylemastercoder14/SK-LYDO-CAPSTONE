"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type ModelField = {
  name: string;
  type: string;
  constraint: string;
  description: string;
};

type PrismaModel = {
  model: string;
  fields: ModelField[];
};

const Page = () => {
  const [models, setModels] = useState<PrismaModel[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      const res = await fetch("/api/data-dictionary");
      const data = await res.json();
      setModels(data.models);
    };
    fetchModels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <div className="bg-blue-600 text-white dark:bg-blue-800 py-6 px-8 shadow">
        <h1 className="text-3xl font-bold">📘 Data Dictionary</h1>
        <p className="text-blue-100 text-sm mt-1 dark:text-blue-200/80">
          Please screenshot and collapse each section.
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {models.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Loading models...</p>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {models.map((model) => (
              <AccordionItem key={model.model} value={model.model}>
                <AccordionTrigger className="text-lg font-semibold">
                  {model.model}
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="text-base text-muted-foreground dark:text-gray-300">
                        Fields
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-blue-100 dark:bg-blue-900/50">
                            <TableHead>Field Name</TableHead>
                            <TableHead>Data Type</TableHead>
                            <TableHead>Constraint</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {model.fields.map((field, i) => (
                            <TableRow
                              key={field.name}
                              className={`${
                                i % 2 === 0
                                  ? "bg-white dark:bg-gray-900"
                                  : "bg-gray-50 dark:bg-gray-800/80"
                              }`}
                            >
                              <TableCell className="font-medium">
                                {field.name}
                              </TableCell>
                              <TableCell>{field.type}</TableCell>
                              <TableCell>{field.constraint}</TableCell>
                              <TableCell>{field.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default Page;
