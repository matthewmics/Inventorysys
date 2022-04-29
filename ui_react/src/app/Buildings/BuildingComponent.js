import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Dimmer,
  Form,
  Icon,
  Input,
  Loader,
  Modal,
  Popup,
  Segment,
  Select,
} from "semantic-ui-react";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { DelayedSearchInput } from "../Commons/DelayedSearchInput";
import { roleOptions } from "../Commons/Enumerations";
import { ErrorMessage } from "../Commons/ErrorMessage";
import { saveAs } from "file-saver";

import moment from "moment";
import { PopupButton } from "../Commons/PopupButton";
import modalActions from "../../actions/modalActions";
import { BuildingGenerateReportComponent } from "./BuildingGenerateReportComponent";

export const BuildingComponent = () => {
  const dispatch = useDispatch();

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Date Created",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      right: true,
    },
  ];

  const formDefaultValue = {
    name: "",
    id: 0,
  };

  const [archive, setArchive] = useState({
    loading: false,
    data: null,
    open: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(null);
  const [formValue, setFormValue] = useState(formDefaultValue);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [dataTemp, setDataTemp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  const loadBuildings = async () => {
    setLoading(true);
    let response = await agent.Building.list();
    response = response.map((a) => {
      return {
        ...a,
        created_at: dateStringToLocal(a.created_at),
        actions: (
          <>
            <PopupButton
              content="Generate Report"
              iconName="file"
              color="blue"
              onClick={async () => {
                modalActions.openModal(
                  dispatch,
                  "Generate report for building: " + a.name,
                  <BuildingGenerateReportComponent
                    buildingID={a.id}
                    buildingName={a.name}
                  />
                );

                // const req = {
                //   date: moment().format("LLL"),
                //   building_id: a.id,
                // };

                // setReportLoading(true);

                // const response = await agent.Reports.buildingReport(req);

                // saveAs(response, a.name + "-" + moment().format("L") + ".csv");

                // setReportLoading(false);
              }}
            />
            <Popup
              content="Edit Building"
              trigger={
                <Button
                  icon="pencil"
                  circular
                  size="tiny"
                  onClick={() => {
                    setFormValue({
                      id: a.id,
                      name: a.name,
                    });
                    setModalFormOpen(true);
                  }}
                />
              }
            />
            <Popup
              content="Delete Building"
              trigger={
                <Button
                  icon="archive"
                  circular
                  size="tiny"
                  onClick={() => {
                    setArchive({ ...archive, open: true, data: a });
                  }}
                />
              }
            />
          </>
        ),
      };
    });
    setDataTemp(response);
    setData(response);
    setLoading(false);
  };

  useEffect(() => {
    loadBuildings();
  }, []);

  const onFormSubmit = async () => {
    setFormErrors(null);
    setFormLoading(true);
    try {
      const { id, ...req } = formValue;
      if (formValue.id === 0) {
        await agent.Building.create({ ...req });
        toast.success("Building created successfully");
        loadBuildings();
        setModalFormOpen(false);
      } else {
        await agent.Building.update({ ...req }, formValue.id);
        toast.success("Building updated successfully");
        loadBuildings();
        setModalFormOpen(false);
      }
    } catch (err) {
      setFormErrors(err.data.errors);
    } finally {
      setFormLoading(false);
    }
  };

  const onArchive = async () => {
    setArchive({ ...archive, loading: true });
    await agent.Building.delete(archive.data.id);
    toast.success("Building deleted successfully");
    setArchive({ ...archive, loading: false, open: false });
    loadBuildings();
  };

  const handleTextInputChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  return (
    <>
      {" "}
      {reportLoading && (
        <Dimmer active>
          <Loader>Generating Report. Please Wait</Loader>
        </Dimmer>
      )}
      {/* MODAL ARCHIVE */}
      <Modal size="tiny" open={archive.open} closeOnDimmerClick={false}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          Are you sure you want to delete {archive.data?.name} ?
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            loading={archive.loading}
            disabled={archive.loading}
            onClick={() => setArchive({ ...archive, open: false })}
          >
            Cancel
          </Button>
          <Button
            loading={archive.loading}
            disabled={archive.loading}
            positive
            onClick={() => onArchive()}
          >
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
      {/* MODAL FORM */}
      <Modal size="tiny" open={modalFormOpen} closeOnDimmerClick={false}>
        <Modal.Header>
          {formValue.id === 0 ? "Create new building" : `Edit building`}
        </Modal.Header>
        <Modal.Content>
          {formErrors && <ErrorMessage errors={formErrors} />}
          <Form>
            <Form.Field>
              <label>Name</label>
              <input
                name="name"
                value={formValue.name}
                placeholder="Building name"
                onChange={handleTextInputChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            loading={formLoading}
            disabled={formLoading}
            onClick={() => setModalFormOpen(false)}
          >
            Cancel
          </Button>
          <Button
            loading={formLoading}
            disabled={formLoading}
            positive
            onClick={() => onFormSubmit()}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
      <div>
        <div className="page-header-title">
          BUILDINGS <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>
      <div className="mb-10 clearfix">
        <div className="disp-ib">
          <DelayedSearchInput
            onSearch={(val) => {
              setData(
                dataTemp.filter((a) => a.name.toLowerCase().includes(val))
              );
            }}
          />
        </div>
        <div className="float-r disp-ib">
          <Button
            size="small"
            color="green"
            onClick={() => {
              setFormValue(formDefaultValue);
              setModalFormOpen(true);
            }}
          >
            <Icon name="add" /> Create Building
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} pagination striped />
    </>
  );
};
