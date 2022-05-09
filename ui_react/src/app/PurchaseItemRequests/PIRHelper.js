import { dateStringToLocal } from "../../helpers"
import { LabelRepairStatus } from "../Commons/LabelRepairStatus"

export const ProcessPIRDetails = (row) =>{
    return {
        Requestor: <b>{row.requestor}</b>,
        Department: <b>{row.department}</b>,
        "To Purchase": row.to_purchase,
        For: row.destination.name,
        "Created At": dateStringToLocal(row.created_at),
        Status: <LabelRepairStatus status={row.status} />,
        "Worked On By": row.worker_object
          ? row.worker_object.name
          : "-",
      }
}