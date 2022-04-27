import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { Loader } from "semantic-ui-react";
import modalActions from "../../../actions/modalActions";
import agent from "../../../agent";
import { PopupButton } from "../../Commons/PopupButton";
import { ConfirmationModal } from "../../Commons/ConfirmationModal";
import { toast } from "react-toastify";
import moment from "moment";

export const BorrowContent = () => {
  const dispatch = useDispatch();

  const columns = [];

  const [dt, setDt] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const response = await agent.Borrow.processable();

    // setDt(response);

    setLoading(false);
  };

  return (
    <>
      <div>
        <div className="page-header-title">
          BORROWS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>

      <DataTable columns={columns} data={dt} pagination striped />
    </>
  );
};
