// Revision guard is independent of React so async cancellation can be tested.
export const createRoleFitRevisionGuard = () => {
  let revision = 0;
  let active = true;
  return {
    bump: () => ++revision,
    current: () => revision,
    isCurrent: (candidate) => active && revision === candidate,
    dispose: () => { active = false; ++revision; },
  };
};

export const enhanceRoleFitWith = async ({ baseline, gate, revision, producer, validate, apply }) => {
  try {
    const raw = await producer();
    if (!gate.isCurrent(revision)) return { status: "stale" };
    const safe = validate(raw);
    if (!safe) return { status: "unchanged" };
    const assessment = apply(baseline, safe);
    if (!gate.isCurrent(revision)) return { status: "stale" };
    return assessment === baseline
      ? { status: "unchanged" }
      : { status: "applied", assessment };
  } catch {
    return gate.isCurrent(revision) ? { status: "failed" } : { status: "stale" };
  }
};
