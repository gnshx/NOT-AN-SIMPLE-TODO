import { EmailIngestionWorker } from '../../../web/src/lib/jobs/emailWorker';

export async function runCrossTenantJobTests() {
  const results: { name: string; passed: boolean; details: string }[] = [];

  // Simulate background job carrying forged or mismatched workspaceId
  let jobRejected = false;
  try {
    const worker = new EmailIngestionWorker();
    const forgedJob = {
      id: 'job-forged-999',
      data: {
        workspaceId: '', // Empty workspace ID violates tenant boundary
        rawEmail: 'Candidate email body'
      }
    };

    const outcome = await worker.process(forgedJob as any);
    if (!outcome.success) {
      jobRejected = true;
    }
  } catch {
    jobRejected = true;
  }

  results.push({
    name: 'Tenancy: Cross-tenant background job boundary check',
    passed: jobRejected,
    details: 'Background worker must reject job payloads lacking validated workspace context.'
  });

  return results;
}
