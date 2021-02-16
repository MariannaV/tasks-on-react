import React from "react";
import { observer } from "mobx-react-lite";
import { List, Card } from "antd";
import { usersStore } from "../../../store";
import { NUsers } from "../../../store/@types";
import { ListItem } from "./listItem";
import { UserModal } from "../userModal";
import { NUserForm } from "../userForm";
import CreateUserIcon from "../../../assets/img/plus-icon.png";
import styles from "./styles.scss";

export const UsersList = observer(function UsersList() {
  const { list, loading } = usersStore;

  const renderItem = React.useCallback(
    (userId: NUsers.IUser["id"]) => <ListItem userId={userId} key={userId} />,
    []
  );

  const pageSize = 6,
    lastLoadedPage = React.useRef<number>(1),
    [totalItems, setTotalItems] = React.useState<number>(0),
    onPageChange = React.useCallback(async (page: number) => {
      //we need to use it because test API doesn't add new users to database
      if (lastLoadedPage.current >= page) return;
      lastLoadedPage.current = page;

      const data = await usersStore.getUsers({ page });
      setTotalItems(data.total);
    }, []),
    paginationSettings = React.useMemo(
      () => ({
        onChange: onPageChange,
        pageSize,
        hideOnSinglePage: true,
        total: Math.max(totalItems, list.length),
      }),
      [onPageChange, pageSize, totalItems, list.length]
    );

  React.useEffect(function onFetchInitData() {
    (async function onFetchUsers() {
      const data = await usersStore.getUsers();
      setTotalItems(data.total);
    })();
  }, []);

  return (
    <List
      className={styles.list}
      itemLayout="vertical"
      size="large"
      loading={Boolean(loading)}
      pagination={paginationSettings}
      renderItem={renderItem}
      dataSource={list}
      footer={<ListFooter />}
    />
  );
});

function ListFooter() {
  const [isModalVisible, setIsModalVisible] = React.useState<null | boolean>(
      null
    ),
    onShowModal = React.useCallback(() => setIsModalVisible(true), []),
    formProps = React.useMemo(
      () => ({
        mode: NUserForm.FormModes.creation,
      }),
      []
    ),
    className = React.useMemo(
      () => [styles.listItemWrapper, styles.buttonOpenModalCreateNew].join(" "),
      []
    );

  return (
    <>
      <Card
        hoverable
        className={className}
        children={<img src={CreateUserIcon} alt="Create new user" />}
        onClick={onShowModal}
      />
      <UserModal
        title="Create new user"
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        formProps={formProps}
      />
    </>
  );
}
