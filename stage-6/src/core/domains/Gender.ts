export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export const genderLabels: Record<Gender, string> = {
  [Gender.Male]: '男',
  [Gender.Female]: '女',
}
