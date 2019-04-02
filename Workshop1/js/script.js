
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

$(function () {
    loadBookData();
});

$(document).ready(function () {
    kendo.culture("zh-TW");
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,

            pageSize: 10
        },
        height: 500,
        groupable: false,
        sortable: true,
        filterable: false,
        pageable: {
            input: true,
            numeric: false,
        },
        toolbar: ["<input type=text class=form-control id='FieldFilter' placeholder='我想要找...'>"],
        columns: [
            { command: { text: "刪除", click: deletedata }, width: "80px" },
            { field: "BookId", title: "書籍編號", width: "100px" },
            { field: "BookName", title: "書籍名稱", width: "160px" },
            { field: "BookCategory", values: bookCategoryList, title: "書籍種類", width: "100px" },
            { field: "BookAuthor", title: "作者", width: "100px" },
            { field: "BookBoughtDate", title: "購買日期", width: "100px" },
            { field: "BookPublisher", title: "送達狀態", width: "100px" },
            { field: "BookPrice", title: "金額", width: "80px" },
            { field: "BookAmount", title: "數量", width: "100px" },
            { field: "BookTotal", title: "總計", width: "100px" }]
    });

    function deletedata(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.target).closest("tr"));
        var dataSource = $("#book_grid").data("kendoGrid").dataSource;
        kendo.confirm("確定刪除「" + dataItem.BookName + "」 嗎?").then(function () {
            dataSource.remove(dataItem);
        });
    };
});

//搜尋
$(document).ready(function () {
    $("#FieldFilter").keyup(function () {

        var value = $("#FieldFilter").val();
        grid = $("#book_grid").data("kendoGrid");
        if (value) {
            grid.dataSource.filter({
                logic: "or",
                filters: [{ field: "BookName", operator: "contains", value: value }, { field: "BookAuthor", operator: "contains", value: value }]
            }
            );
        }

        else {
            grid.dataSource.filter({});
        }
    });
});