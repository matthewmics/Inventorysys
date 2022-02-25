import React, { useEffect, useState } from "react";
import { Button, Icon, Label, Loader, Popup, Table } from "semantic-ui-react";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";
import { downloadBase64File } from "../../libs/download";
import { LabelTransferStatus } from "../Commons/LabelTransferStatus";

export const DepartmentDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState(null);

  const loadData = async () => {
    setLoading(true);

    setTransfers(await agent.TransferRequest.list());

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div>
        <div className="page-header-title">
          DASHBOARD
          <Loader active={loading} inline size="tiny" />
        </div>
        <hr></hr>
      </div>

      {transfers && (
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                style={{ backgroundColor: "#f1f8e9" }}
                colSpan="100%"
              >
                <Icon name="dolly" />
                Transfer Requests
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Item</Table.HeaderCell>
              <Table.HeaderCell>From</Table.HeaderCell>
              <Table.HeaderCell>To</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {transfers.length === 0 && (
              <Table.Row textAlign="center">
                <Table.Cell colSpan="100%">
                  <div style={{ padding: "30px" }}>
                    There are no records to display.
                  </div>
                </Table.Cell>
              </Table.Row>
            )}

            {transfers.map((t) => {
              return (
                <Table.Row key={t.id}>
                  <Table.Cell>
                    {t.item.inventory_parent_item.name}
                    <div style={{ color: "grey" }}>{t.item.serial_number}</div>
                  </Table.Cell>
                  <Table.Cell>
                    {t.current_room ? t.current_room.name : "Inventory"}
                  </Table.Cell>

                  <Table.Cell>{t.destination_room.name}</Table.Cell>
                  <Table.Cell>{dateStringToLocal(t.created_at)}</Table.Cell>
                  <Table.Cell>
                    <LabelTransferStatus status={t.status}></LabelTransferStatus>
                  </Table.Cell>
                  <Table.Cell style={{ float: "right" }}>
                    <Popup
                      content="Download Attached"
                      trigger={
                        <Button
                          primary
                          icon="file word"
                          circular
                          size="tiny"
                          onClick={async () => {
                            const response = await agent.FileStorage.get(t.file_storage_id);
                            downloadBase64File(response.base64, response.name);
                          }}
                        />
                      }
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </>
  );
};
