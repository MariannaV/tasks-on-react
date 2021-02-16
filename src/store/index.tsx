import React from "react";
import { NUsers } from "./@types";
import { observable, flow } from "mobx";

export const usersStore = observable<NUsers.IUsersStore>({
  list: [],
  map: {},
  loading: null,
  getUsers: flow(function* getUsers(settings = {}) {
    try {
      this.loading = true;

      const { page = 1 } = settings;

      const response = yield fetch(`https://reqres.in/api/users/?page=${page}`);

      if (!response.ok) throw new Error("Something went wrong");

      const data = yield response.json() as ReturnType<
          NUsers.IUsersStore["getUsers"]
        >,
        { data: usersData, per_page } = data;

      for (let index = 0; index < usersData.length; index++) {
        const currentUser = usersData[index];
        this.map[currentUser.id] = currentUser;
      }

      this.list = [
        ...this.list.slice(0, page * per_page),
        ...usersData.map((userData: NUsers.IUser) => userData.id),
        ...this.list.slice((page + 1) * per_page),
      ];

      return data;
    } catch (error) {
      console.error("Get Users request error:", error);
      throw error;
    } finally {
      this.loading = false;
    }
  }),
  getUser: flow(function* getUser(settings) {
    const { userId } = settings;
    try {
      this.map[userId].loading = true;
      const response = yield fetch(`https://reqres.in/api/users/?id=${userId}`);
      return yield response.json();
    } catch (error) {
      console.error("Get user request error:", error);
      throw error;
    } finally {
      this.map[userId].loading = false;
    }
  }),
  changeUserData: flow(function* (settings) {
    try {
      const { userData, operation } = settings;

      const { requestMethod, urlParams } = (() => {
        switch (operation) {
          case "creation": {
            return { requestMethod: "POST" };
          }
          case "edit": {
            return {
              requestMethod: "PUT",
              urlParams: new URLSearchParams({
                ...(userData.id && { id: userData.id }),
              }),
            };
          }
          case "deletion": {
            return {
              requestMethod: "DELETE",
              urlParams: new URLSearchParams({
                ...(userData.id && { id: userData.id }),
              }),
            };
          }

          default:
            return {};
        }
      })();

      const response = yield fetch(
        [
          `https://reqres.in/api/users/`,
          urlParams?.toString() && `?${urlParams.toString()}`,
        ].join(""),
        {
          method: requestMethod,
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      switch (operation) {
        case "creation": {
          const data = yield response.json();
          this.map[data.id] = data;
          this.list.push(data.id);
          break;
        }
        case "edit": {
          const data = yield response.json();
          this.map[data.id] = { ...this.map[data.id], ...data };
          break;
        }
        case "deletion": {
          this.list = this.list.filter((id) => id !== userData.id);
          delete this.map[userData.id];
        }
      }
    } catch (error) {
      console.error("Change data request error:", error);
      throw error;
    }
  }),
});
