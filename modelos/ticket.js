mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema([
  {
    company: { type: String },
    incidentNumber: { type: String },
    incidentObject: { type: String },
    incidentFault: { type: String },
    status: { type: String, default:'Open' },
    object: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    fault: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    who: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    geo: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    location: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    timing: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    pattern: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    sequence: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    phase: {
      is: { type: String, default: "" },
      butNot: { type: String, default: "" },
      whyNot: { type: String, default: "" }
    },
    possibleCause: [{
      key: { type: String, default: 0 },
      cause: { type: String, default: "" },
      object: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      fault: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      who: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      geo: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      location: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      timing: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      pattern: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      sequence: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      phase: {
        value: { type: String, default: "" },
        assumption: { type: String, default: "" },
        assumptionId: { type: String, default: "" }
      },
      show: { type: Boolean, default: false },
      assumptionCount: { type: Number, default: 0 },
      resolution: { type: String, default: 'na' },
      color: { type: String, default: 'white' },
    }],

  }
]);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
