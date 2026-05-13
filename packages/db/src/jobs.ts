import type { JobKind, JobPayload } from '@techgarimpeiro/core';
import type { Json } from './database.types.js';
import { getDbClient } from './client.js';

export async function enqueueJob<K extends JobKind>(
  kind: K,
  payload: JobPayload[K],
  opts?: { priority?: number; scheduledFor?: Date },
): Promise<void> {
  const db = getDbClient();
  const { error } = await db.from('job_queue').insert({
    kind,
    payload: payload as unknown as Json,
    priority: opts?.priority ?? 5,
    scheduled_for: opts?.scheduledFor?.toISOString() ?? new Date().toISOString(),
  });
  if (error) throw new Error(`enqueueJob(${kind}): ${error.message}`);
}

export async function claimJobs(
  kind: JobKind,
  limit: number,
  workerName: string,
): Promise<Array<{ id: number; payload: unknown }>> {
  const db = getDbClient();
  const { data, error } = await db.rpc('claim_jobs', {
    p_kind: kind,
    p_limit: limit,
    p_worker: workerName,
  });
  if (error) throw new Error(`claimJobs(${kind}): ${error.message}`);
  return (data as Array<{ id: number; payload: unknown }>) ?? [];
}

export async function completeJob(jobId: number, result?: unknown): Promise<void> {
  const db = getDbClient();
  const { error } = await db.rpc('complete_job', {
    p_job_id: jobId,
    p_result: (result ?? null) as unknown as Json,
  });
  if (error) throw new Error(`completeJob(${jobId}): ${error.message}`);
}

export async function failJob(jobId: number, errorMessage: string): Promise<void> {
  const db = getDbClient();
  const { error } = await db.rpc('fail_job', {
    p_job_id: jobId,
    p_error: errorMessage,
  });
  if (error) throw new Error(`failJob(${jobId}): ${error.message}`);
}
