var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];
// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}

$(document).ready(function () {
    loadBookData();
    kendo.culture("zh-TW");
    kendoGrid();
    addBooks();
    transLate();
    search();
});
//word change
function transLate() {
    for (var i = 0; i < bookDataFromLocalStorage.length; i++) {
        for (var j = 0; j < bookCategoryList.length; j++) {
            if (bookDataFromLocalStorage[i]['BookCategory'] == bookCategoryList[j]['value']) {
                bookDataFromLocalStorage[i]['BookCategory'] = bookCategoryList[j]['text'];
            }
        }
    }
}
//tooltip show
function IconDetail(e) {
    var grid = $("#book_grid").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));
    $("#book_grid").kendoTooltip({
        filter: "d",
        animation: false,
        content: function () {
            return dataItem.BookDeliveredDate;
        }
    });
}
//set image to change what u choose
function ChangeImage() {
    var value = $("#book_category").val();
    for (var i = 0; i < bookCategoryList.length; i++) {
        if (value == bookCategoryList[i]['value']) {
            var img = bookCategoryList[i]['src']
            $(".book-image").attr("src", img);
        }
    }
}
//search
function search() {
    $("#search").keyup(function () {
        var sValue = $('#search').val();
        $("#book_grid").data("kendoGrid").dataSource.filter({
            logic: "or",
            filters: [
                {
                    field: "BookName",
                    operator: "contains",
                    value: sValue
                },
                {
                    field: "BookAuthor",
                    operator: "contains",
                    value: sValue
                }
            ]
        });
    });
}
//deleteAction and alert
function actionDelete(e) {
    e.preventDefault();
    var tr = $(e.target).closest("tr");
    var data = this.dataItem(tr);
    var grid = $("#book_grid").data("kendoGrid");
    kendo.confirm("確定刪除「" + data.BookName + "」?").then(function () {
        grid.dataSource.remove(data);
        var bookData = grid.dataSource._data;
        localStorage.clear();
        localStorage.setItem("bookData", JSON.stringify(bookData));
    });

}
//dataSource
function kendoGrid() {
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: { type: "string" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "date" },
                        BookDeliveredDate: { type: "string" },
                        BookPrice: { type: "number" },
                        BookAmount: { type: "number" },
                        BookTotal: { type: "number" }
                    }
                }
            }
        },
        height: 450,
        scrollable: true, /*滾動*/
        sortable: true,  /*排序*/
        pageable: {

            pageSize: 20
        },
        toolbar: [
            { template: kendo.template($("#searchjs").html()) }
        ],
        columns: [
            {
                command: [
                    {
                        name: "刪除",
                        click: actionDelete
                    }
                ]
            },
            { field: "BookId", title: "書籍編號" },
            { field: "BookName", title: "書籍名稱" },
            { field: "BookCategory", title: "書籍種類" },
            { field: "BookAuthor", title: "作者" },
            { field: "BookBoughtDate", title: "購買日期", format: "{0:yyyy-MM-dd}" },
            {
                field: "BookDeliveredDate", title: "送達狀態", template: "# if (BookDeliveredDate != null  ) { #<d  class='fa fa-truck' onmouseover='IconDetail(this)' ></d># } #"
            },
            {
                field: "BookPrice", title: "金額", format: "{0:n0}",
                attributes: {
                    "class": "table-cell",
                    style: "text-align: right",

                }
            },
            {
                field: "BookAmount", title: "數量", format: "{0:n0}",
                attributes: {
                    "class": "table-cell",
                    style: "text-align: right"
                }
            },
            {
                field: "BookTotal", title: "總計", format: "{0:n0}元",
                attributes: {
                    "class": "table-cell",
                    style: "text-align: right"
                }
            }
        ],
        editable: "inline"
    });

}
//add & savebook
function addBooks() {
    //下拉式選單
    $("#book_category").kendoDropDownList({
        dataSource: bookCategoryList,
        dataTextField: "text",
        dataValueField: "value",
        animation: false,
        index: 0,
        change: ChangeImage
    });
    //送達日期
    $("#delivered_datepicker").kendoDatePicker({
        animation: false,
        format: "yyyy-MM-dd",
        parseFormats: ["yyyyMMdd", "yyyy/MM/dd"]
    });
    //數量價錢
    $("#book_price,#book_amount").kendoNumericTextBox({
        decimals: 0,    //取整數
        format: "{0:n0}",   //三位一撇
        min: 0,
        step: 1
    });
    $("#add_book").click(function () {
        //購買日期
        $("#bought_datepicker").kendoDatePicker({
            animation: false,
            value: new Date(),
            dateInput: true,
            format: "yyyy-MM-dd",
            parseFormats: ["yyyyMMdd", "yyyy/MM/dd"]
        });
        //windo視窗
        $("#book_window").kendoWindow({
            width: "600px",
            draggable: true,
            title: "新增書籍",
            actions: ["Minimize", "Maximize", "Pin", "Close"],
            modal: true
        }).data("kendoWindow").center().open();
        //金額與數量變動需即時顯示
        $("#book_price,#book_amount").change(function () {
            var book_price = $("#book_price").val();
            var book_amount = $("#book_amount").val();
            var book_total = book_price * book_amount;
            $("#book_total").html(book_total.toLocaleString());
            $("#book_total").val(book_total);
        });
    });
    //送達日期不可早於購買日期    
    var validator = $("#book_form").kendoValidator({
        rules: {
            greaterdate: function (input) {
                if (input.is("[data-greaterdate-msg]") && input.val() != "") {
                    var date = kendo.parseDate(input.val()),
                        otherDate = kendo.parseDate($("[name='" + input.data("greaterdateField") + "']").val());
                    return otherDate == null || otherDate.getTime() < date.getTime();
                }

                return true;
            }
        }
    }).data("kendoValidator");
    //資料驗證及新增資料
    $("#save_book").click(function () {
        if (validator.validate()) {
            var grid = $("#book_grid").data("kendoGrid");
            var book_category = $("#book_category").val();
            var book_name = $("#book_name").val();
            var book_author = $("#book_author").val();
            var bought_datepicker = $("#bought_datepicker").val();
            var delivered_datepicker = $("#delivered_datepicker").val();
            var book_price = $("#book_price").val();
            var book_amount = $("#book_amount").val();
            var book_total = $("#book_total").val();
            bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
            var book_id = bookDataFromLocalStorage[bookDataFromLocalStorage.length - 1]['BookId'];
            book_id = Number(book_id) + 1;
            if (delivered_datepicker == '') {
                delivered_datepicker = null;
            }
            for (var j = 0; j < bookCategoryList.length; j++) {
                if (book_category == bookCategoryList[j]['value']) {
                    book_category = bookCategoryList[j]['text'];
                }
            }
            grid.dataSource.add({
                BookId: book_id,
                BookCategory: book_category,
                BookName: book_name,
                BookAuthor: book_author,
                BookBoughtDate: bought_datepicker,
                BookDeliveredDate: delivered_datepicker,
                BookPrice: book_price,
                BookAmount: book_amount,
                BookTotal: book_total
            });
            var bookData = grid.dataSource._data;
            localStorage.clear();
            localStorage.setItem("bookData", JSON.stringify(bookData));
            $("#book_form").find(":text").each(function () {
                $(this).val("");
            });
            $("#book_total").html();
            $(this).closest("[data-role=window]").data("kendoWindow").close();
        }
        else {
            console.log('輸入有誤，請重新填寫');
        }
    });
}




