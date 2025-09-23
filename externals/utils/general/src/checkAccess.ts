


// export function checkAccess(
//   rules: string[],
//   userAccesses: Array<{
//     feature: string;
//     access: number;
//     module: string;
//     type: 'mobile' | 'panel';
//   }>
// ) {
//   for (const rule of rules) {
//     const [ruleFeature, ruleAccess] = rule.split('>=')
//     for (const { access, feature } of userAccesses) {
//       if (feature == ruleFeature && access >= Number(ruleAccess)) return true
//     }
//   }
//   return false;
// }

export function checkAccess(
  rules: string[],
  roles?: Array<{
    id?: string;
    code?: string;
    name?: string;
    app_id?: string;
    app_name?: string;
    app_code?: string;
    accesses?: Array<{
      id?: string;
      feature?: string;
      access?: string;
      role_id?: string;
    }>
  }>
) {
  if (!roles?.filter(Boolean)?.length) return true;
  for (const rule of (rules ?? [])) {
    const [ruleFeature, ruleAccess] = rule.split('>=');
    for (const role of roles) {
      if (role.accesses) {
        for (const { feature, access } of role.accesses) {
          if (feature == ruleFeature && Number(access) >= Number(ruleAccess)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}