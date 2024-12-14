export interface IFormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface IForm {
  _id?: string;
  title: string;
  description: string;
  fields: IFormField[];
  createdBy?: string;
  shareableLink?: string;
}

export interface IFormSection {
  id: string;
  title: string;
  fields: IFormField[];
}