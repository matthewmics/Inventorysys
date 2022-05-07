import React, { Fragment, useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button, Icon, Loader, Tab, Table } from "semantic-ui-react";
import { useLocation, useParams } from "react-router-dom";
import agent from "../../agent";
import moment from "moment";
import { useSelector } from "react-redux";

const transferHeaders = [
  "Status",
  "Date",
  "Requestor",
  "Item",
  "Serial/Asset #",
  "From",
  "To",
];
const repairHeaders = [
  "Status",
  "Date",
  "Requestor",
  "Item",
  "Serial/Asset #",
  "Details",
];
const borrowHeaders = [
  "Status",
  "Date",
  "Borrower",
  "Department",
  "Requested Date",
  "To Borrow",
  "purpose",
  "Worked On By",
  "Action Date",
];

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const ReportForRequests = () => {
  const query = useQuery();

  const { selectedItems } = useSelector((state) => state.report);

  const [loading, setLoading] = useState(false);

  const [reportData, setReportData] = useState([]);

  const [headers, setHeaders] = useState([]);

  const getReportType = () => {
    return query.get("type");
  };

  useEffect(() => {
    switch (getReportType()) {
      case "transfers":
        setHeaders(transferHeaders);
        break;
      case "repairs":
        setHeaders(repairHeaders);
        break;
      default:
        setHeaders(borrowHeaders);
    }

    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);

    let response = null;

    const req = {
      date: moment().format("LLL"),
      status_to_generate: [...selectedItems],
    };

    switch (getReportType()) {
      case "transfers":
        response = await agent.Reports.transferReport(req);
        break;
      case "repairs":
        response = await agent.Reports.repairReport(req);
        break;
      default:
        response = await agent.Reports.borrowReport(req);
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
          {true ? "Building" : "Room"}: <b>{query.get("name")}</b>
          <span style={{ marginRight: "50px" }}> </span>
          As of: <b>{moment().format("LLL")}</b>
        </div>

        {/* TABLE */}
        <Table style={{ fontSize: "10px" }}>
          <Table.Header>
            <Table.Row style={{ fontSize: "10px" }}>
              {headers.map((header, index) => {
                return (
                  <Fragment key={index}>
                    <Table.HeaderCell>{header}</Table.HeaderCell>
                  </Fragment>
                );
              })}
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
      </div>
    </>
  );
};
