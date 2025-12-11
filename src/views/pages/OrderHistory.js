import { orderHistory } from "../../app.js";
import i18n from "../../services/i18n.js";

let OrderHistory = {

    render: async () => {

        let historyTitle = i18n.getString("OrderHistory", "historyTitle");
        let dateHeading = i18n.getString("OrderHistory", "dateHeading");
        let numberHeading = i18n.getString("OrderHistory", "numberHeading");
        let totalHeading = i18n.getString("OrderHistory", "totalHeading");
        let statusHeading = i18n.getString("OrderHistory", "statusHeading");

        let view = `
        <section class="orderHistory">
            <h1>${historyTitle}</h1>
            <div class="headings">
                <h3>${dateHeading}</h3>
                <h3>${numberHeading}</h3>
                <h3>${totalHeading}</h3>
                <h3>${statusHeading}</h3>
            </div>`;

        orderHistory.forEach((order, key) => {
            view += `
                <article class="orderItem">
                    <h3>${order.getOrderDate()}</h3>
                    <h3>${order.orderNumber}</h3>
                    <div class="gridPrice">
                        ${i18n.formatCurrency(order.total, "w")}
                    </div>
                    <h3>${order.getOrderStatus()}</h3>
                </article>`
        });
        view += `
        </section>`;

        return view;
    }
    , after_render: async () => {

    }
}

export default OrderHistory;