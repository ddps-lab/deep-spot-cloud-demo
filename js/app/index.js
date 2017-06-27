/**
 * Created by kde713 on 2017. 5. 1..
 */

var reloadBtns = [];

function shrinkServiceInfo() {
    $("#info-text-full").hide();
    $("#info-text-short").show();
}

function expandServiceInfo() {
    $("#info-text-short").hide();
    $("#info-text-full").show();
}

function reloadChart(dataSize) {
    if(dataSize > 3) {
        if(!confirm("The requested action may cause the browser to stop responding. Do you want to proceed anyway?")) return;
    }
    $.LoadingOverlay("show");
    let chartData = sampleData(dataSize);
    window.savingChart.load({
        columns: [
            chartData[0],
            chartData[1]
        ]
    });
    for (let idx in reloadBtns) reloadBtns[idx].prop("disabled", idx == (dataSize - 1));
    $.LoadingOverlay("hide");
}

$(document).ready(function () {
    // 0. Add button div to array
    reloadBtns = [$("#reload_btn_1"), $("#reload_btn_2"), $("#reload_btn_3"), $("#reload_btn_4")];

    // 1. Get current timezone offset
    const tzOffset = -(new Date().getTimezoneOffset() / 60);

    // 2. Define selector which will used in data view
    const view_current_running = $("#view_current_running");
    const view_current_price = $("#view_current_price");
    const view_current_region = $("#view_current_region");
    const view_current_step = $("#view_current_step");
    const view_current_saving = $("#view_current_saving");

    // 2. Request Cloud data via ajax
    $.ajax({
        type: "GET",
        url: BASE_URL + "/deploy?local=" + tzOffset,
        success: function (data) {
            // 3. Putting data in variables
            const data_source_current_running = {
                "title": "CIFAR-10 image classification (CNN)",
                "link": "https://www.tensorflow.org/tutorials/deep_cnn"
            };
            const data_current_running = "<a href='" + data_source_current_running.link + "' title='" + data_source_current_running.title + "' target='_blank'>" + shortenString(data_source_current_running.title) + "</a>";
            const data_current_price = data["lastinfo"]["price"];
            const data_current_region = data["lastinfo"]["az"];
            // const data_current_step = numeral(data["lastinfo"]["step"]).format("0.0a");
            const data_current_step = data["lastinfo"]["step"];
            const data_current_saving = 12.54;
            const data_saving_flow = sampleData(1);

            // 4-1. Render static data
            view_current_running.html(data_current_running);
            view_current_price.text(data_current_price);
            view_current_region.text(data_current_region);
            view_current_step.text(data_current_step);
            view_current_saving.text(data_current_saving + "%");

            // 4-2. Render chart
            window.savingChart = c3.generate({
                bindto: "#view_saving_chart",
                data: {
                    x: 'x',
                    xFormat: '%Y%m%d%H',
                    columns: [
                        data_saving_flow[0],
                        data_saving_flow[1]
                    ]
                },
                type: 'spline',
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y.%m.%d %H:00'
                        }
                    }
                },
                regions: [
                    {axis: 'y', end: data_current_saving}
                ],
                zoom: {
                    enabled: true
                }
            });

            // 4-3. Activate reload button
            reloadBtns[1].prop("disabled", false);
            reloadBtns[2].prop("disabled", false);
            reloadBtns[3].prop("disabled", false);
        },
        error: function (e) {
            alert("Unexpected error occured while loading cloud data.");
        }
    });
});