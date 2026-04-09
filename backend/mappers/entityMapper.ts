export const withId = <T extends object>(payload: T, id: string): T & { id: string } => {
  return { ...payload, id };
};
