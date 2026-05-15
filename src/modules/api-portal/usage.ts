export type ApiUsageSummaryInput = {
  statusCode: number;
  latencyMs: number | null;
  units: number;
};

export function summarizeApiUsage(rows: ApiUsageSummaryInput[]) {
  const totalRequests = rows.length;
  const totalUnits = rows.reduce((sum, row) => sum + row.units, 0);
  const errorRequests = rows.filter((row) => row.statusCode >= 400).length;
  const latencyRows = rows.filter((row) => row.latencyMs !== null);
  const averageLatencyMs =
    latencyRows.length === 0
      ? null
      : Math.round(
          latencyRows.reduce((sum, row) => sum + (row.latencyMs ?? 0), 0) / latencyRows.length,
        );

  return {
    totalRequests,
    totalUnits,
    errorRequests,
    averageLatencyMs,
  };
}
