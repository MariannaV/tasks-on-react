export namespace NUsers {
  export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  }

  export interface IUsersStore {
    list: Array<IUser["id"]>;
    map: Record<IUser["id"], IUser & { loading?: boolean }>;
    loading: null | boolean;
    getUsers: (settings?: {
      page?: number;
    }) => Promise<{
      data: Array<IUser>;
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    }>;
    getUser: (settings: { userId: number }) => Promise<IUser>;
    changeUserData: (settings: {
      userData: IUser;
      operation: "creation" | "edit" | "deletion";
    }) => Promise<void>;
  }
}
