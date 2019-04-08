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
})
$(document).ready(function () {
    kendo.culture("zh-TW");
    kendoGrid();
    addBooks();

    for (var i = 0; i < bookDataFromLocalStorage.length; i++) {
        for (var j = 0; j < bookCategoryList.length; j++) {
            if (bookDataFromLocalStorage[i]['BookCategory'] == bookCategoryList[j]['value']) {
                bookDataFromLocalStorage[i]['BookCategory'] = bookCategoryList[j]['text'];
            }
        }
    }

});


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
        height: 550,
        scrollable: true, /*滾動*/
        sortable: true,  /*排序*/
        pageable: {
            input: true,
            numeric: false,
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
                        click: function (e) {
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
function addBooks() {
    //DownList
    $("#book_category").kendoDropDownList({
        dataSource: bookCategoryList,
        dataTextField: "text",
        dataValueField: "value",
        index: 0,
        change: ChangeImage
    });
    
}
function IconDetail(e) {
    var grid = $("#book_grid").data("kendoGrid");
    var dataItem = grid.dataItem($(e).closest("tr"));
    $("#book_grid").kendoTooltip({
        filter: "d",
        animation: false,
        content: function (e) {
            return dataItem.BookDeliveredDate;
        }
    });
}
function ChangeImage() {
    var value = $("#book_category").val();
    for (var i = 0; i < bookCategoryList.length; i++) {
        if (value == bookCategoryList[i]['value']) {
            var src = bookCategoryList[i]['src']
            $(".book-image").attr("src", src);
        }
    }
}
