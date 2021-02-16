import React from "react";
import { observer } from "mobx-react-lite";
import { Card, Button } from "antd";
import { usersStore } from "../../../store";
import { UserModal } from "../../../pages/users/userModal";
import { NUsers } from "../../../store/@types";
import { NUserForm } from "../userForm";
import AvatarDefault from "../../../assets/img/no-image.png";
import styles from "./styles.scss";

interface IListItem {
  userId: NUsers.IUser["id"];
}

export const ListItem: React.FC<IListItem> = observer((props) => {
  const { userId } = props,
    userData = usersStore.map[userId];

  return (
    <Card
      hoverable
      className={styles.listItemWrapper}
      cover={<img alt="example" src={userData?.avatar ?? AvatarDefault} />}
    >
      <Card.Meta title={`${userData?.first_name} ${userData?.last_name}`} />
      <ListItemDetails userId={userId} />
    </Card>
  );
});

function ListItemDetails(props: Pick<IListItem, "userId">) {
  const [isModalVisible, setIsModalVisible] = React.useState<null | boolean>(
      null
    ),
    onShowModal = React.useCallback(() => setIsModalVisible(true), []);

  const formProps = React.useMemo(
    () => ({
      id: props.userId,
      mode: NUserForm.FormModes.view,
    }),
    [props.userId]
  );

  return (
    <>
      <Button children="Details" onClick={onShowModal} type="primary" />
      <UserModal
        title="User information"
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        formProps={formProps}
      />
    </>
  );
}
