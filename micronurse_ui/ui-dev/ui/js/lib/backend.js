/******************************************************************************
Copyright (c) 2016, Intel Corporation

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Intel Corporation nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*****************************************************************************/
// Use array for parameters, assuming batch (i.e. sending / returning multiple objects)
//
// Object usually always has id, name, description. Receiver may use the id
// and then call related functions in interface to get the details
//
// For events, it only returns the type of the event and impacted entity, but
// doesn't need to provide more details. It's client that need to use APIs
// to fetch the updated details for the entities
//
// Object schema
// app:{
//   id: ...
//   name: ...
//   description: ...
//   graphs: [{
//     id: ...
//     name: ...
//     description: ...
//     status: {
//       enabled: ...
//     }
//   }]
// }
//
// graph: {
//   status: {...}
//   graph: the_graph_json
// }
//
// spec_bundle.list: [ {
//  id: ...
//  name: ...
//  description: ...
//
// }
// ]
//
// bundle: see samples/spec_bundles.js
//
// hub.list: [ {
//   id: ...
//   name: ...
//   description: ...
// }
// ]
//
// hub: see samples/hub.js
//
//

// For now we only need one implementation of above interface
var WebBackend = {
  user: {},
  app: {},
  ui: {},
  graph: {},
  spec_bundle: {},
  hub: {},
  thing: {},
  service: {},
  package: {},
  config: {}
};

function invoke(api) {
  var params = _.toArray(arguments);
  params.shift();
  return $Q($.ajax({
    type: "POST",
    url: "apis/dev",
    data: JSON.stringify({
      api: api,
      params: params
    }),
    contentType: "application/json",
    dataType: "json"
  }).then(function(data) {
    $hope.log("API", "[Invoke]", api, "\n            [Params]",
      params, "\n            [Result]", data);
    return data;
  }, function(err) {
    var res = err.responseText;
    $hope.log.warn("API", "[Invoke]", api, "\n            [Params]",
      params, "\n            [Error]", res, err);
    if (res === "__HOPE_LOGIN_REQUIRED__") {
      location.replace("/#/login");
      return;
    }
    if (_.startsWith(res, "__HOPE_ERROR__")) {
      var res2 = res.substr(14);
      var msg = __(res2);
      return new Error(msg === res2 ? msg.replace(/_/g, " ") : msg);
    }
    if (res) {
      return new Error(res);
    }
    return err;
  }));
}

WebBackend.get_config$ = function() {
  return invoke("sys.get_config");
};

WebBackend.get_errors$ = function() {
  return invoke("sys.errors");
};

WebBackend.get_nodered_assets$ = function() {
  return invoke("sys.get_nodered_assets");
};

WebBackend.user.login$ = function(name, pass) {
  return invoke("user.login", name, pass);
};

WebBackend.user.logout$ = function() {
  return invoke("user.logout");
};

WebBackend.user.register$ = function(data) {
  return invoke("user.register", data);
};

WebBackend.user.remove$ = function(id) {
  return invoke("user.remove", id);
};

WebBackend.user.change_passwd$ = function(oldpass, newpass) {
  return invoke("user.change_passwd", oldpass, newpass);
};

WebBackend.user.update$ = function(data) {
  return invoke("user.update", data);
};

WebBackend.user.list$ = function() {
  return invoke("user.list");
};

WebBackend.app.list$ = function() {
  return invoke("app.list");
};

WebBackend.app.create_graph$ = function(app_id, graph) {
  return invoke("app.create_graph", {
    app: app_id,
    graph: graph
  });
};

WebBackend.app.create_nr_graph$ = function(app_id, graph) {
  return invoke("app.create_nr_graph", {
    app: app_id,
    graph: graph
  });
};

WebBackend.app.create$ = function(app_name, desc) {
  return invoke("app.create", {
    name: app_name,
    description: desc
  });
};

WebBackend.app.update$ = function(app_id, props) {
  return invoke("app.update", {
    app: app_id,
    props: props
  });
};

WebBackend.app.remove$ = function(app_id) {
  return invoke("app.remove", {
    app: app_id
  });
};

WebBackend.app.create_ui$ = function(app_id, ui) {
  return invoke("app.create_ui", {
    app: app_id,
    ui: ui
  });
};

WebBackend.app.get_widget_data$ = function(app_id, widget_id) {
  return invoke("app.get_widget_data", {
    app: app_id,
    widget: widget_id
  });
};


WebBackend.ui.get$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  return invoke("ui.get", ids);
};

WebBackend.ui.update$ = function(ui) {
  return invoke("ui.update", ui);
};

WebBackend.ui.remove$ = function(ids) {
  return invoke("ui.remove", ids);
};

WebBackend.graph.get$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  return invoke("graph.get", ids);
};

WebBackend.graph.update$ = function(graph) {
  return invoke("graph.update", graph);
};

WebBackend.graph.remove$ = function(ids) {
  return invoke("graph.remove", ids);
};

WebBackend.graph.start$ = function(ids, tracing) {
  return invoke("graph.start", ids, tracing);
};

WebBackend.graph.stop$ = function(ids) {
  return invoke("graph.stop", ids);
};

WebBackend.graph.trace$ = function(ids) {
  return invoke("graph.trace", ids);
};

WebBackend.graph.debug_trace$ = function(ids, limit) {
  return invoke("graph.debug_trace", ids, limit);
};

WebBackend.graph.set_debug_for_node$ = function(graph_id, node_id, is_debug) {
  return invoke("graph.set_debug_for_node", {
    graph_id,
    node_id,
    is_debug
  });
};

WebBackend.graph.status$ = function(ids) {
  return invoke("graph.status", ids);
};

WebBackend.spec_bundle.list$ = function() {
  return invoke("spec_bundle.list");
};

WebBackend.spec_bundle.get$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  return invoke("spec_bundle.get", ids);
};

WebBackend.spec_bundle.get_for_specs$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  return invoke("spec_bundle.get_for_specs", ids);
};

WebBackend.hub.list$ = function() {
  return invoke("hub.list");
};

WebBackend.hub.get$ = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }
  return invoke("hub.get", ids);
};

WebBackend.hub.create_thing$ = function(hub_id, name, desc) {
  return invoke("hub.create_thing", {
    hub: hub_id,
    thing: {
      type: "hope_thing",
      name: name,
      description: desc
    }
  });
};

WebBackend.hub.install_thing$ = function(hub_id, name, version) {
  return invoke("hub.install_thing", {
    hub: hub_id,
    name: name,
    version: version
  });
};

WebBackend.thing.remove$ = function(ids) {
  return invoke("thing.remove", ids);
};

WebBackend.thing.update$ = function(thing) {
  return invoke("thing.update", thing);
};




WebBackend.thing.create_service$ = function(thing_id, name, desc) {
  return invoke("thing.create_service", {
    thing: thing_id,
    service: {
      type: "hope_service",
      name: name,
      description: desc,
      spec: {
        id: $hope.uniqueId("SPEC__"),
        in : {
          "ports": []
        },
        out: {
          "ports": []
        }
      }
    }
  });
};

WebBackend.thing.install_service$ = function(thing_id, name, version) {
  return invoke("thing.install_service", {
    thing: thing_id,
    name: name,
    version: version
  });
};

WebBackend.service.remove$ = function(ids) {
  return invoke("service.remove", ids);
};

WebBackend.service.update$ = function(service) {
  return invoke("service.update", service);
};


WebBackend.service.list_files$ = function(service_id) {
  return invoke("service.list_files", service_id);
};

WebBackend.service.read_file$ = function(service_id, path) {
  return invoke("service.read_file", {
    service_id: service_id,
    file_path: path
  });
};

WebBackend.service.write_file$ = function(service_id, path, content) {
  return invoke("service.write_file", {
    service_id: service_id,
    file_path: path,
    content: content
  });
};

WebBackend.service.remove_file$ = function(service_id, path) {
  return invoke("service.remove_file", {
    service_id: service_id,
    file_path: path
  });
};

WebBackend.service.publish$ = function(service_id, json) {
  return invoke("service.publish", {
    service_id: service_id,
    package_json: json
  });
};

WebBackend.service.install_package$ = function(service_id, package_name, version) {
  return invoke("service.install_package", {
    service_id: service_id,
    package_name: package_name,
    version: version
  });
};

WebBackend.service.uninstall_package$ = function(service_id, package_name) {
  return invoke("service.uninstall_package", {
    service_id: service_id,
    package_name: package_name
  });
};

WebBackend.package.search$ = function(name, pagenumber) {
  return invoke("package.search", name, pagenumber);
};

WebBackend.package.version$ = function(name) {
  return invoke("package.version", name);
};

WebBackend.config.proxy_get$ = function(type, hub_id) {
  return invoke("user_proxy.get", type, hub_id);
};
WebBackend.config.proxy_set$ = function(value) {
  return invoke("user_proxy.set", value);
};

WebBackend.config.npm_account_get$ = function() {
  return invoke("npm_account.get");
};

WebBackend.config.npm_account_set$ = function (user) {
  return invoke("npm_account.set",user);
};

export default WebBackend;