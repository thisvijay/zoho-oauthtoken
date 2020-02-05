var zohodeskAPI_vars = {
    content_json: "application/json; charset=utf-8",
    appBaseURL: "https://desk.zoho.com/api/v1/",
    requiredFields: {
        tickets: {subject: "", departmentId: "", contactId: ""},
        comments: {content: "", isPublic: ""},
        contacts: {lastName: ""},
        accounts: {accountName: ""},
        tasks: {departmentId: "", subject: ""}
    }
};
class zohodeskAPI_Object {
    constructor(name, requires = null) {
        this.name = name;
        this.requiredFields = requires;
    }
    create(data, obj) {
        if (!this.passedRequires(data)) {
            return false;
        }
        var url = this.buildURL(this.getPrimaryURL());
        return obj.httpPOST(url, this.objToString(data));
    }
    update(id, data, obj) {
        console.log(this.objToString(data));
        var url = this.buildURL(this.getPrimaryURL(id));
        return obj.httpPATCH(url, this.objToString(data));
    }
    delete(id, obj) {
        var url = this.buildURL(this.getPrimaryURL(id));
        return obj.httpDELETE(url);
    }
    info(id, params, obj) {
        var param = (params) ? this.handleParameters(params) : "";
        var url = this.buildURL(this.getPrimaryURL(id), param);
        return obj.httpGET(url);
    }
    all(params, obj) {
        var param = (params) ? this.handleParameters(params) : "";
        var url = this.buildURL(this.getPrimaryURL(), param);
        return obj.httpGET(url);
    }
    buildURL(url, params = null) {
        return (params !== null) ? url + params : url;
    }
    getPrimaryURL(id = null) {
        var returnURL = zohodeskAPI_vars.appBaseURL;
        if (id !== null) {
            returnURL += this.name + "/" + id;
        } else {
            returnURL += this.name;
        }
        return returnURL;
    }
    handleParameters(data) {
        var params = "";
        if (typeof data === "object") {
            for (var item in data) {
                params += item + "=" + data[item] + "&";
            }
        } else {
            return "?" + data;
        }
        return "?" + params.substr(0, params.length - 1);
    }
    passedRequires(data) {
        try {
            var dataObj = (typeof data === "object") ? data : JSON.parse(data);
            for (var item in this.requiredFields) {
                if (dataObj.hasOwnProperty(item)) {
                    if (!dataObj[item]) {
                        console.log("ERROR : Field " + item + " is required to create new " + this.name + "");
                        this.printRequired();
                        return false;
                    }
                } else {
                    console.log("ERROR : Field " + item + " is required to create new " + this.name + "");
                    this.printRequired();
                    return false;
                }
            }
        } catch (exception) {
            console.log("ERROR : Data is not valid JSON");
            return false;
        }
        console.log("All required fields present");
        return true;
    }
    required() {
        this.printRequired();
    }
    printRequired() {
        console.log("Required fields to create new " + this.name + " are ");
        var i = 0;
        for (var item in this.requiredFields) {
            console.log((++i) + " : " + item);
        }
        console.log("-------------");
    }
    objToString(data) {
        return (typeof data === "object") ? JSON.stringify(data) : data;
    }
}
;
class zohodeskAPI_ReadOnly_Obj extends zohodeskAPI_Object {
    create() {}
    update() {}
    delete() {}
}
;
class zohodeskAPI_Secondary_Object {
    constructor(name, parent, requires = null) {
        this.name = name;
        this.parent_name = parent;
        this.requiredFields = requires;
    }
    create(parent_id, data, obj) {
        if (!this.passedRequires(data)) {
            return false;
        }
        var url = this.buildURL(this.getPrimaryURL(parent_id));
        return obj.httpPOST(url, this.objToString(data));
    }
    update(parent_id, id, data, obj) {
        var url = this.buildURL(this.getPrimaryURL(parent_id, id));
        return obj.httpPATCH(url, this.objToString(data));
    }
    delete(parent_id, id, obj) {
        var url = this.buildURL(this.getPrimaryURL(parent_id, id));
        return obj.httpDELETE(url);
    }
    info(parent_id, id, params, obj) {
        var param = (params) ? this.handleParameters(params) : "";
        var url = this.buildURL(this.getPrimaryURL(parent_id, id), param);
        return obj.httpGET(url);
    }
    all(parent_id, params, obj) {
        var param = (params) ? this.handleParameters(params) : "";
        var url = this.buildURL(this.getPrimaryURL(parent_id), param);
        return obj.httpGET(url);
    }
    buildURL(url, params = null) {
        return (params !== null) ? url + params : url;
    }
    getPrimaryURL(parent_id = null, id = null) {
        var returnURL = zohodeskAPI_vars.appBaseURL;
        var type = this.name;
        if (parent_id !== null) {
            returnURL += this.parent_name + "/" + parent_id;
            if (id !== null) {
                returnURL += "/" + this.name + "/" + id;
            } else {
                returnURL += (type === this.name) ? "/" + this.name : "";
            }
        } else {
            console.log("ERROR : "+this.parent_name+"-ID is missing ");
            throw new Error("ERROR : "+this.parent_name+"-ID is missing ");
            return false;
            //returnURL += this.parent_name;
        }
        return returnURL;
    }
    handleParameters(data) {
        var params = "";
        if (typeof data === "object") {
            for (var item in data) {
                params += item + "=" + data[item] + "&";
            }
        } else {
            return "?" + data;
        }
        return "?" + params.substr(0, params.length - 1);
    }
    passedRequires(data) {
        try {
            var dataObj = (typeof data === "object") ? data : JSON.parse(data);
            for (var item in this.requiredFields) {
                if (dataObj.hasOwnProperty(item)) {
                    if (!dataObj[item]) {
                        console.log("ERROR : Fieldl " + item + " is required to create new " + this.name + "");
                        this.printRequired();
                        return false;
                    }
                } else {
                    console.log("ERROR : Fieldl " + item + " is required to create new " + this.name + "");
                    this.printRequired();
                    return false;
                }
            }
        } catch (exception) {
            console.log("ERROR : Data is not valid JSON");
            return false;
        }
        console.log("All required fields present");
        return true;
    }
    required() {
        this.printRequired();
    }
    printRequired() {
        console.log("Required fields to create new " + this.name + " are ");
        var i = 0;
        for (var item in this.requiredFields) {
            console.log((++i) + " : " + item);
        }
        console.log("-------------");
    }
    objToString(data) {
        return (typeof data === "object") ? JSON.stringify(data) : data;
    }
}
;
//var tickets = new zohodeskAPI_Object("tickets",zohodeskAPI_vars.requiredFields.tickets);
//var comments = new zohodeskAPI_Secondary_Object("comments", "tickets", zohodeskAPI_vars.requiredFields.comments);
//var contacts = new zohodeskAPI_Object("contacts", zohodeskAPI_vars.requiredFields.contacts);
//var accounts = new zohodeskAPI_Object("accounts", zohodeskAPI_vars.requiredFields.accounts);
//var tasks = new zohodeskAPI_Object("tasks", zohodeskAPI_vars.requiredFields.tasks);
//var agents = new zohodeskAPI_ReadOnly_Obj("agents");
//var departments = new zohodeskAPI_ReadOnly_Obj("departments");
class zohodeskAPI {
    constructor(auth_token, orgId) {
        this.authtoken = auth_token;
        this.orgId = orgId;
        this.tickets = new zohodeskAPI_Object("tickets", zohodeskAPI_vars.requiredFields.tickets);
        this.comments = new zohodeskAPI_Secondary_Object("comments", "tickets", zohodeskAPI_vars.requiredFields.comments);
        this.contacts = new zohodeskAPI_Object("contacts", zohodeskAPI_vars.requiredFields.contacts);
        this.accounts = new zohodeskAPI_Object("accounts", zohodeskAPI_vars.requiredFields.accounts);
        this.tasks = new zohodeskAPI_Object("tasks", zohodeskAPI_vars.requiredFields.tasks);
        this.agents = new zohodeskAPI_ReadOnly_Obj("agents");
        this.departments = new zohodeskAPI_ReadOnly_Obj("departments");
        
        this.tickets.quickCreate = function (subject, departmentId, contactId, productId = "", email = "", phone = "", description = "") {
            return {
                "subject": subject,
                "departmentId": departmentId,
                "contactId": contactId,
                "productId": productId,
                "email": email,
                "phone": phone,
                "description": description
            };
        };
        this.comments.quickCreate = function (ticketID,content, isPublic = true) {
            return {
                "content": content,
                "isPublic": (isPublic)?"true":"false"
            };
        };
        
        this.contacts.quickCreate = function (lastName, firstName = "", email = "", phone = "", description = "") {
            return {
                "lastName": lastName,
                "firstName": firstName,
                "email": email,
                "phone": phone,
                "description": description
            };
        };
        this.accounts.quickCreate = function (accountName, email = "", website = "") {
            return {
                "accountName": accountName,
                "email": email,
                "website": website
            };
        };
        this.tasks.quickCreate = function (departmentId, subject, description = "", priority = "", ticketId = null) {
            return {
                "departmentId": departmentId,
                "subject": subject,
                "description": description,
                "priority": priority,
                "ticketId": ticketId
            };
        };

    }

    createTicket(data) {
        var dataJsonObj=this.getValidJson(data);
        var dataObj = (dataJsonObj) ? dataJsonObj : this.tickets.quickCreate.apply(this, arguments);
        return this.tickets.create(dataObj, this);
    }
    updateTicket(id, data) {
        return this.tickets.update(id, data, this);
    }
    ticketDetails(id, params = "") {
        return this.tickets.info(id, params, this);
    }
    allTickets(params = "") {
        return this.tickets.all(params, this);
    }

    allComments(ticketID, params = "") {
        return this.comments.all(ticketID, params, this);
    }
    createComment(ticketID, comment_data, is_public = true) {
        var dataJsonObj=this.getValidJson(comment_data);
        var dataObj = (dataJsonObj) ? dataJsonObj : this.comments.quickCreate.apply(this, arguments);
        return this.comments.create(ticketID, dataObj, this);
    }
    updateComment(ticketID, commentID, comment_data) {
        return this.comments.update(ticketID, commentID, comment_data, this);
    }
    deleteComment(ticketID, commentID) {
        return this.comments.delete(ticketID, commentID, this);
    }
    commentDetails(ticketID, commentID, params = "") {
        return this.comments.info(ticketID, commentID, params, this);
    }

    allContacts(params = "") {
        return this.contacts.all(params, this);
    }
    createContact(data) {
        var dataJsonObj=this.getValidJson(data);
        var dataObj = (dataJsonObj) ? dataJsonObj : this.contacts.quickCreate.apply(this, arguments);
        return this.contacts.create(dataObj, this);
    }
    updateContact(id, data) {
        return this.contacts.update(id, data, this);
    }
    contactDetails(id, params = "") {
        return this.contacts.info(id, params, this);
    }

    allAccounts(params = "") {
        return this.accounts.all(params, this);
    }
    createAccount(data) {
        var dataJsonObj=this.getValidJson(data);
        var dataObj = (dataJsonObj) ? dataJsonObj : this.accounts.quickCreate.apply(this, arguments);
        return this.accounts.create(dataObj, this);
    }
    updateAccount(id, data) {
        return this.accounts.update(id, data, this);
    }
    accountDetails(id, params = "") {
        return this.accounts.info(id, params, this);
    }

    allTasks(params = "") {
        return this.tasks.all(params, this);
    }
    createTask(data) {
        var dataJsonObj=this.getValidJson(data);
        var dataObj = (dataJsonObj) ? dataJsonObj : this.tasks.quickCreate.apply(this, arguments);
        return this.tasks.create(dataObj, this);
    }
    updateTask(id, data) {
        return this.tasks.update(id, data, this);
    }
    taskDetails(id, params = "") {
        return this.tasks.info(id, params, this);
    }

    allAgents(params = "") {
        return this.agents.all(params, this);
    }
    agentDetails(id, params = "") {
        return this.agents.info(id, params, this);
    }

    allDepartments(params = "") {
        return this.departments.all(params, this);
    }
    departmentDetails(id, params = "") {
        return this.departments.info(id, params, this);
    }

    checkJquey() {
        return (window.jQuery) ? true : false;
    }
    buildURL(url, params = null) {
        return (params !== null) ? url + params : url;
    }
    httpGET(url) {
        return this.httpExecute(url, this.httpSettings("GET", this.httpHeaders()));
    }
    httpPOST(url, data) {
        return this.httpExecute(url, this.httpSettings("POST", this.httpHeaders(), data));
    }
    httpPATCH(url, data) {
        return this.httpExecute(url, this.httpSettings("PATCH", this.httpHeaders(), data));
    }
    httpDELETE(url) {
        return this.httpExecute(url, this.httpSettings("DELETE", this.httpHeaders()));
    }
    httpHeaders() {
        var authtoken = this.authtoken;
        return (new Headers({
            "Authorization": authtoken,
            "orgId": this.orgId,
            "contentType": zohodeskAPI_vars.content_json,
        }));
    }
    httpSettings(method, headers, data = "") {
        var settingsObj = {
            method: method,
            headers: headers,
            mode: 'cors'
        };
        if (method === "POST" || method === "PATCH" || method === "PUT") {
            settingsObj.body = data;
        }
        return settingsObj;
    }
    httpExecute(url, http_settings) {
        var api_response;
        var returnResult=null;
        if (this.checkJquey()) {
            return this.httpAjax(url, http_settings);
            return false;
        }
        return fetch(url, http_settings).then(function (response) {
            api_response = response;
            if (response.ok) {
                return response.json();
            }
            throw new Error("Request Not Successful");
        }).then(function (result) {
            debugTraceNative(api_response, api_response.ok);
            console.log(JSON.stringify(result));
            returnResult= result;
            returnThis(result);
            //$('#TicketList .ResponsePanel').text(JSON.stringify(result, null, 2));
            //debugTraceNative(api_response, api_response.ok);
        }).catch(function (error) {
            console.log(error);
                console.log(api_response);
//            debugTraceNative(api_response, api_response.ok);
            if(!api_response.ok || http_settings.method==="DELETE"){
                console.log(error);
                console.log(api_response);
            }
            //debugTraceNative(api_response, api_response.ok);
        });
        
    }
    httpAjax(url, http_settings) {
        console.log("URL:" + url);
        console.log("htt:" + http_settings.headers);
        var result=null;
        url='https://mobilesupport.localzoho.com/api/v1/tickets/3220000001196208/threads?authtoken=7e5631cec7b6144db56a834f663aa4cd&orgId=11141888';
        $.ajax({
            method: http_settings.method,
            url: url,
            async: false,
            dataType: "json",
            headers: {
                "Authorization": this.authtoken,
                "orgId": this.orgId
            },
            contentType: http_settings.contentType,
            data: http_settings.body,
            success: function (data, textStatus, jqXHR) {
                result=data;
            },
            error: function (jqXHR, tranStatus) {
                if(http_settings.method==="DELETE" && jqXHR.status=="200"){
                    debugTrace(jqXHR,{deleted:'true'}, 'success');
                }else{
                    debugTrace(jqXHR, tranStatus);
                }
            }
        });
        return result;
    }
    getValidJson(string) {
       // console.log(string);
        switch (typeof string){
            case "object":
                return string;
                break;
            case "string":
                try{
                    var obj=JSON.parse(string);
                    return (typeof obj==="object")?obj:false;
                }
                catch (exception) {
                    return false;
                }
                return false;
                break;
            default :
                return false;
        }
    }
    checkEnoughArgs(passed,needed) {
        return needed>=passed;
    }
    assignDefaults() {
        this.authtoken = "59550a0e2b1a864a31bef962363e029f";
        this.orgId = 652853630;
    }
};
/*
function ZAPI_Ticket() {
    this.id;
    this.subject = "";
    this.departmentId = "";
    this.contactId = "";
    this.productId;
    this.uploads;
    this.email;
    this.phone;
    this.description;
    this.status;
    this.assigneeId;
    this.category;
    this.subCategory;
    this.resolution;
    this.dueDate;
    this.priority;
    this.channel;
    this.classification;
    this.customFields;
    this.createdTime;
    this.modifiedTime;
    this.timeEntryCount;
    this.approvalCount;
    this.commentCount;
    this.attachmentCount;
    this.taskCount;
    this.threadCount;
    this.product;
    this.closedTime;
    this.ticketNumber;
    this.contact;
    this.customerResponseTime;
    this.required = {
        subject: this.subject, departmentId: this.departmentId, contactId: this.contactId
    };
    this.readOnly = {
        id: this.id,
        createdTime: this.createdTime,
        modifiedTime: this.modifiedTime,
        timeEntryCount: this.timeEntryCount,
        approvalCount: this.approvalCount,
        commentCount: this.commentCount,
        attachmentCount: this.attachmentCount,
        taskCount: this.taskCount,
        threadCount: this.threadCount,
        product: this.product,
        closedTime: this.closedTime,
        ticketNumber: this.ticketNumber,
        contact: this.contact,
        customerResponseTime: this.customerResponseTime
    };
}
*/
function returnThis(data){
    console.log(data);
    return data;
}
function debugTrace(jqXHR, data, status) {
    
    if(window.jQuery){
    $('#responseCode').text("Code: " + jqXHR.status + " Status: " + jqXHR.statusText).css({color: (status == 'success') ? 'blue' : 'red'});
    }
    console.log(JSON.stringify(data, null, 2));
    if(window.jQuery){
    $('.ResponsePanel').text(JSON.stringify(data, null, 2));
    }
    console.log(jqXHR);
}
function debugTraceNative(response, status) {
    if(window.jQuery){
    $('#responseCode').text("Code: " + response.status + " Status: " + response.statusText).css({color: (status) ? 'blue' : 'red'});
    }
    console.log(response);
}
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};