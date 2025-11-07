/* eslint-disable react/no-children-prop */
import { useState } from "react";
import { KitchenOrderData } from "./TypesAndDefaultes";
import { Button } from "rsuite";
import KitchenOrderDetails from "./KitchenOrderDetails";
import EyeCloseIcon from "@rsuite/icons/EyeClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons/faPrint";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import { useAppSelector } from "@/lib/hooks";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { printPdfBlobSameTab } from "./OrderHelpers";
pdfMake.vfs = pdfFonts as unknown as { [file: string]: string };

const KitchenOrders = ({ order }: { order: KitchenOrderData }) => {
  const bill = useAppSelector((state) => state?.order);
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrderData | null>(
    null
  );

  const handleViewButtonClick = (order: KitchenOrderData) => {
    setSelectedOrder(order); // Set the selected order to show in the modal
  };

  const closeModal = () => {
    setSelectedOrder(null); // Close the modal
  };

  const handlePrint = () => {
    const docDefinition = {
      pageSize: { width: 227, height: "auto" }, // Credit card size in mm
      pageMargins: [2, 2, 2, 2], // Very small margins
      content: [
        {
          text: `Bill No- ${order?.billNo}`,
          style: "header",
        },

        {
          table: {
            widths: ["*"],
            heights: [1],
            body: [
              [
                {
                  text: "   Kitchen Copy   ",
                  border: [false, false, false, true],
                  fillColor: "#eeeeee",
                  style: { alignment: "center", fontSize: 10, bold: "true" },
                },
              ],
            ],
          },
          margin: [0, 2],
        },

        {
          columns: [
            {
              stack: [
                {
                  text: [
                    { text: "Bill No.: ", bold: true },
                    `${order?.billNo}`,
                  ],
                  style: "infoText",
                },
                {
                  text: [{ text: "Table Name:", bold: true }, order?.tableName],
                  style: "infoText",
                },
                {
                  text: [
                    { text: "waiter Name: ", bold: true },
                    order?.waiterName,
                  ],
                  style: "infoText",
                },
              ],
              width: "60%",
            },
            {
              stack: [
                {
                  text: [
                    { text: "Date: ", bold: true },
                    new Date(bill.date).toLocaleDateString(),
                  ],
                  style: "infoText",
                },
                {
                  text: [
                    { text: "Time: ", bold: true },
                    new Date(bill.date).toLocaleTimeString(),
                  ],
                  style: "infoText",
                },
                {
                  text: [{ text: "Guest: ", bold: true }, bill?.guest],
                  style: "infoText",
                },
              ],
              width: "40%",
              alignment: "center",
            },
          ],
        },
        {
          table: {
            widths: [40, 100, 30],
            headerRows: 1,
            body: [
              [
                { text: "Code", bold: true },
                { text: "Name", bold: true },
                { text: "Qty", bold: true },
              ],
              ...(order?.items?.map((item) => {
                return [
                  { text: item.itemCode ?? 0 },
                  { text: item.itemName ?? " " },
                  { text: item.qty ?? 0 },
                ];
              }) as unknown as string[]),
            ],
          },
          style: "infoText",
          layout: "headerLineOnly",
        },
      ],
      styles: {
        infoText: { fontSize: 9, margin: [0, 1, 0, 1] }, // Smaller font and tighter spacing
        barcodeText: { fontSize: 4, bold: true }, // Reduced barcode font size
        header: {
          bold: true,
          alignment: "center",
          fontSize: 18,
        },
        subHeader: {
          alignment: "center",
          fontSize: 8,
        },
      },
    };

    pdfMake
      .createPdf(docDefinition as unknown as TDocumentDefinitions)
      .getBlob((result) => {
        printPdfBlobSameTab(result);
      });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          children={<EyeCloseIcon />}
          appearance="primary"
          color="blue"
          onClick={() => handleViewButtonClick(order)}
        />
        <Button
          children={<FontAwesomeIcon icon={faPrint} />}
          appearance="primary"
          color="green"
          onClick={() => handlePrint()}
        />
      </div>

      {selectedOrder && (
        <KitchenOrderDetails kitchenItem={selectedOrder} onClose={closeModal} />
      )}
    </div>
  );
};

export default KitchenOrders;
