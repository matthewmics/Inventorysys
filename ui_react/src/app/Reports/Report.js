import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button, Icon, Loader, Tab, Table } from "semantic-ui-react";
import { useLocation, useParams } from "react-router-dom";
import agent from "../../agent";
import moment from "moment";
import { useSelector } from "react-redux";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const Report = () => {
  const { id } = useParams();
  const query = useQuery();

  const { selectedItems } = useSelector((state) => state.report);

  const [loading, setLoading] = useState(false);

  const [reportData, setReportData] = useState([]);

  const isBuilding = () => {
    return query.get("type") === "building";
  };

  const getType = () => {
    return query.get("type");
  };

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);

    let response = null;

    if (getType() === "building") {
      const req = {
        date: moment().format("LLL"),
        building_id: id,
        items_to_generate: [...selectedItems],
      };
      response = await agent.Reports.buildingReport(req);
    } else if (getType() === "room") {
      const req = {
        date: moment().format("LLL"),
        room_id: id,
        items_to_generate: [...selectedItems],
      };
      response = await agent.Reports.roomReport(req);
    } else {
      const req = {
        date: moment().format("LLL"),
        items_to_generate: [...selectedItems],
      };
      response = await agent.Reports.inventoryReport(req);
    }

    setReportData(response);

    setLoading(false);
  };

  if (loading) return <Icon loading name="spinner" size="big" />;

  return (
    <>
      <Button
        size="small"
        primary
        onClick={() => {
          var container = document.getElementById("container");

          var opt = {
            margin: 0.3,
            filename: "spcf_inventory_report.pdf",
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          };

          html2pdf().set(opt).from(container).save();
        }}
      >
        DOWNLOAD PDF
      </Button>
      <div style={{ height: "2em" }}></div>
      <div id="container">
        {/* HEADER TEXT */}
        <div style={{ fontSize: "10px" }}>
          {getType() === "inventory" ? (
            <><b>Inventory</b></>
          ) : (
            <>
              {getType() === "building" ? "Building" : "Room"}:{" "}
              <b>{query.get("name")}</b>
            </>
          )}
          <span style={{ marginRight: "50px" }}> </span>
          As of: <b>{moment().format("LLL")}</b>
        </div>

        {/* TABLE */}
        <Table style={{ fontSize: "10px" }}>
          <Table.Header>
            <Table.Row style={{ fontSize: "10px" }}>
              <Table.HeaderCell>EQUIPMENT</Table.HeaderCell>
              <Table.HeaderCell>BRAND</Table.HeaderCell>
              <Table.HeaderCell>QTY</Table.HeaderCell>
              <Table.HeaderCell colSpan={4}>STATUS</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>W</Table.HeaderCell>
              <Table.HeaderCell>N</Table.HeaderCell>
              <Table.HeaderCell>R</Table.HeaderCell>
              <Table.HeaderCell>B</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {/* <Table.Row>
              <Table.Cell>No Name Specified</Table.Cell>
              <Table.Cell>Unknown</Table.Cell>
              <Table.Cell>None</Table.Cell>
            </Table.Row> */}
            {reportData.map((val, index) => {
              return (
                <Table.Row key={index}>
                  {val.map((x, index) => {
                    return <Table.Cell key={index}>{x}</Table.Cell>;
                  })}
                </Table.Row>
              );
            })}

            
          </Table.Body>
        </Table>

        {/* LEGEND TEXT */}
        <table>
          <tbody>
            <tr style={{ fontSize: "10px" }}>
              <td style={{ padding: "15px", paddingLeft: "0px" }}>
                W: Working
              </td>
              <td style={{ padding: "15px" }}>N: Not Working</td>
              <td style={{ padding: "15px" }}>R: Repairing</td>
              <td style={{ padding: "15px" }}>B: Borrowed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
