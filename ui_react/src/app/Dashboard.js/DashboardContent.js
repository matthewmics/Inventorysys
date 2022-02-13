import React, { useEffect, useState } from "react";
import { Icon, Label, Loader, Table } from "semantic-ui-react";
import agent from "../../agent";
import { dateStringToLocal } from "../../helpers";

export const DashboardContent = () => {
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
        <>
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
            </Table.Header>{" "}
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Requested By</Table.HeaderCell>
                <Table.HeaderCell>Item</Table.HeaderCell>
                <Table.HeaderCell>From</Table.HeaderCell>
                <Table.HeaderCell>To</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
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
                  <>
                    <Table.Row key={t.id}>
                      <Table.Cell>{t.requestor.name}</Table.Cell>
                      <Table.Cell>
                        {t.item.inventory_parent_item.name}
                        <div style={{ color: "grey" }}>
                          {t.item.serial_number}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {t.current_room ? t.current_room.name : "Inventory"}
                      </Table.Cell>

                      <Table.Cell>{t.destination_room.name}</Table.Cell>
                      <Table.Cell>{dateStringToLocal(t.created_at)}</Table.Cell>
                      <Table.Cell>
                        <Label>{t.status}</Label>
                      </Table.Cell>
                    </Table.Row>
                  </>
                );
              })}
            </Table.Body>
          </Table>
        </>
      )}
    </>
  );
};
