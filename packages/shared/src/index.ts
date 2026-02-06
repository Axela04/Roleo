export const VECTOR_MATCH_SQL = `
select j.*, 1 - (e.embedding <=> :profile_embedding) as similarity
from jobs j
join embeddings e on e.owner_type = 'job' and e.owner_id = j.id
order by e.embedding <=> :profile_embedding asc
limit :limit;
`;

export function buildNetworkingQueries(company: string, role: string) {
  const archetypes = ['Hiring Manager', 'Team Lead', 'Recruiter'];
  return archetypes.map((a) => `site:linkedin.com/in ${company} ${role} ${a}`);
}
