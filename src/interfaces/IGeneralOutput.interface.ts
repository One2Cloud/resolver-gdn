export interface IGeneralResponse<Data> {
  status: number;
  success: boolean;
  onchain: boolean;
  data?: Data;
  error?: {
    code: string;
    reason?: string;
  };
  empty: boolean;
}
