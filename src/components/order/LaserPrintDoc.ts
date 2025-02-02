// const laserPrint = (bill:any) =>{
//   //  const doc: TDocumentDefinitions = {
//   //   pageSize: "A4", // Set page size to A4
//   //   pageMargins: [40, 40, 40, 80], // Adjust margins for A4
//   //   content: [
//   //     {
//   //       text: bill?.branch?.name,
//   //       style: "header",
//   //     },
//   //     {
//   //       text: bill?.branch?.address1,
//   //       style: "subHeader",
//   //     },
//   //     {
//   //       text: bill?.branch?.address2,
//   //       style: "subHeader",
//   //     },
//   //     {
//   //       text: `Helpline: ${bill?.branch?.phone}`,
//   //       style: "subHeader",
//   //     },
//   //     {
//   //       text: `BIN: ${bill?.branch?.binNo || "..."}`,
//   //       style: "subHeader",
//   //     },
//   //     {
//   //       table: {
//   //         widths: ["*"],
//   //         heights: [1],
//   //         body: [
//   //           [
//   //             {
//   //               text: "   Customer Copy   ",
//   //               border: [false, false, false, true],
//   //               fillColor: "#eeeeee",
//   //               style: { alignment: "center", fontSize: 12, bold: true },
//   //             },
//   //           ],
//   //         ],
//   //       },
//   //       margin: [0, 10],
//   //     },
//   //     {
//   //       columns: [
//   //         {
//   //           stack: [
//   //             {
//   //               text: [
//   //                 { text: "Vat Reg: ", bold: true },
//   //                 bill?.branch?.vatNo,
//   //               ],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [{ text: "Bill No.: ", bold: true }, bill.billNo],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [
//   //                 { text: "Table Name:", bold: true },
//   //                 bill?.tableName?.name,
//   //               ],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [
//   //                 { text: "Waiter Name: ", bold: true },
//   //                 bill?.waiter?.name,
//   //               ],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [
//   //                 { text: "Guest Name: ", bold: true },
//   //                 bill?.customer?.name,
//   //               ],
//   //               style: "infoText",
//   //             },
//   //           ],
//   //           width: "60%",
//   //         },
//   //         {
//   //           stack: [
//   //             {
//   //               text: [
//   //                 { text: "Bill Date: ", bold: true },
//   //                 new Date(bill.date).toLocaleDateString(),
//   //               ],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [
//   //                 { text: "Bill Time: ", bold: true },
//   //                 new Date(bill.date).toLocaleTimeString(),
//   //               ],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [{ text: "Guest: ", bold: true }, bill.guest],
//   //               style: "infoText",
//   //             },
//   //           ],
//   //           width: "40%",
//   //           alignment: "right",
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       table: {
//   //         widths: [300, 50, 50, 50],
//   //         headerRows: 1,
//   //         body: [
//   //           [
//   //             { text: "Item Name", bold: true },
//   //             { text: "Qty", bold: true },
//   //             { text: "Rate", bold: true },
//   //             { text: "Amount", bold: true },
//   //           ],
//   //           ...(bill?.items?.map((item: any) => {
//   //             return [
//   //               { text: item?.item?.itemName },
//   //               { text: item?.qty },
//   //               { text: item?.rate },
//   //               {
//   //                 text: parseFloat((item?.rate * item?.qty).toFixed(2)),
//   //               },
//   //             ];
//   //           }) as []),
//   //         ],
//   //       },
//   //       style: "infoText",
//   //       layout: "headerLineOnly",
//   //       margin: [0, 10],
//   //     },
//   //     {
//   //       table: {
//   //         widths: ["*"],
//   //         body: [
//   //           [
//   //             {
//   //               text: "",
//   //               border: [false, false, false, true],
//   //               style: { alignment: "center", fontSize: 12, bold: true },
//   //             },
//   //           ],
//   //         ],
//   //       },
//   //       margin: [0, 10],
//   //     },
//   //     {
//   //       columns: [
//   //         {
//   //           stack: [
//   //             {
//   //               text: [{ text: "Food Amount: " }],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [{ text: "Total Discount: " }],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [{ text: `Vat(${bill?.vat}):` }],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [
//   //                 { text: `Service Charge(${bill?.serviceChargeRate}):` },
//   //               ],
//   //               style: "infoText",
//   //             },
//   //           ],
//   //           width: "50%",
//   //           alignment: "right",
//   //         },
//   //         {
//   //           stack: [
//   //             {
//   //               text: [{ text: bill?.totalBill, bold: true }],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [{ text: bill?.totalDiscount }],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [{ text: bill?.totalVat }],
//   //               style: "infoText",
//   //             },
//   //             {
//   //               text: [{ text: bill?.serviceCharge }],
//   //               style: "infoText",
//   //             },
//   //           ],
//   //           width: "40%",
//   //           alignment: "right",
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       table: {
//   //         widths: ["*"],
//   //         body: [
//   //           [
//   //             {
//   //               text: "",
//   //               border: [false, false, false, true],
//   //               style: { alignment: "center", fontSize: 12, bold: true },
//   //             },
//   //           ],
//   //         ],
//   //       },
//   //       margin: [0, 10],
//   //     },
//   //     {
//   //       columns: [
//   //         {
//   //           stack: [
//   //             {
//   //               text: [{ text: "Net Payable: " }],
//   //               style: "totalText",
//   //             },
//   //           ],
//   //           width: "50%",
//   //           alignment: "right",
//   //         },
//   //         {
//   //           stack: [
//   //             {
//   //               text: [{ text: bill?.netPayable }],
//   //               style: "totalText",
//   //             },
//   //           ],
//   //           width: "40%",
//   //           alignment: "right",
//   //         },
//   //       ],
//   //     },
//   //     {
//   //       text: `In Word: ${numberToWord.convert(bill.netPayable)}`,
//   //       style: {
//   //         fontSize: 10,
//   //         bold: true,
//   //         alignment: "left",
//   //       },
//   //       margin: [0, 10],
//   //     },
//   //     // footer
//   //   ],
//   //   footer: function (currentPage, pageCount) {
//   //     return {
//   //       stack: [
//   //         {
//   //           text: "Thank you for coming!",
//   //           fillColor: "#eeeeee",
//   //           style: { alignment: "center", fontSize: 12, bold: true },
//   //           margin: [0, 5],
//   //           alignment: "center",
//   //         },
//   //         {
//   //           columns: [
//   //             {
//   //               text: `Time: ${new Date().toLocaleTimeString()}`, // Current time
//   //               style: "footerText",
//   //               alignment: "left",
//   //               margin: [40, 5, 0, 0],
//   //             },
//   //             {
//   //               text: `${session?.data?.user?.name ?? "Unknown"}`, // Logged-in user
//   //               style: "footerText",
//   //               alignment: "right",
//   //               margin: [0, 5, 40, 0],
//   //             },
//   //           ],
//   //         },
//   //         {
//   //           text: " Software Developed By MAS IT Solutions. Hot Line: 01915682291",
//   //           style: "footerText",
//   //           alignment: "center",
//   //           margin: [0, 5],
//   //         },
//   //       ],
//   //     };
//   //   },
//   //   styles: {
//   //     infoText: { fontSize: 10, margin: [0, 2, 0, 2] }, // Adjusted font size and spacing
//   //     header: {
//   //       bold: true,
//   //       alignment: "center",
//   //       fontSize: 24,
//   //     },
//   //     subHeader: {
//   //       alignment: "center",
//   //       fontSize: 12,
//   //     },
//   //     totalText: {
//   //       fontSize: 14,
//   //       bold: true,
//   //       color: "green",
//   //       margin: [0, 2, 0, 2],
//   //     },
//   //   },
//   // };
//   // pdfMake.createPdf(doc).print();
// }