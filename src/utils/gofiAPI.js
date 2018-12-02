
import axios from 'axios'

class Graph {
    constructor(graph){
        this.id = graph.id;
        this.name = graph.name;
        this.nodes = graph.nodes;
        this.description = graph.description
        this.connections = graph.connections;
        if( graph.connections === null || graph.connections === undefined){
            this.connections = []
        }
        if( graph.nodes === null || graph.nodes === undefined){
            this.nodes = []
        }
     //   this.processNode()
    }

    processNode(){
        this.nodes =  this.nodes.map(node => {
            node.params = "";
            node.list = [{name: "test",val: "value"}];
            node.fields = {
                "in": [{"name": "960c6741-e39c-4b0e-b6c6-9f699e3a3cf5"}],
                "out": [{"name": "960c6741-e39c-4b0e-b6c6-9f699e3a3cf5"}]
            }
            return node
        })
    }

    getStatus(node){
        Gofi.getStatus(node.id).then(data => {
                node.status = data
            }
        )
    }

    getGraph(){
        return this;
    }
}

class GofiAPI {
    constructor() {
        this.baseurl = "http://192.168.0.125:8000"
    }
    processGraphs(g){
        if(Array.isArray(g)){
            return g.map(_g => new Graph(_g))
        } else {
            return new Graph(g)
        }
    }
    getAllGraphs(){
        return axios.get(this.baseurl+"/graph").then(response => {
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }
    getGraph(id){
        return axios.get(this.baseurl+"/graph/"+id).then(response => {
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }
    createNode(id, node){
        return axios.put(this.baseurl+"/graph/"+id+"/node", node).then(response => {
            console.log("NODE", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }

    createGraph(graph){
        return axios.put(this.baseurl+"/graph", graph).then(response => {
            console.log("GRAPH", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }

    deleteGraph(id){
        return axios.delete(this.baseurl+"/graph/"+id).then(response => {
            console.log("GRAPH", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }

    editNode(id, node, nid){
        return axios.post(this.baseurl+"/graph/"+id+"/node/"+nid, node).then(response => {
            console.log("NODE", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }

    editGraph(id, graph){
        return axios.post(this.baseurl+"/graph/"+id, graph).then(response => {
            console.log("graph", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }

    createConnection(id, connection){
        return axios.put(this.baseurl+"/graph/"+id+"/connection", connection).then(response => {
            console.log("connection", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }

    deleteConnection(id, cid){
        return axios.delete(this.baseurl+"/graph/"+id+"/connection/"+cid).then(response => {
            console.log("connection", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }

    updateNode(id, node){
        return axios.post(this.baseurl+"/graph/"+id+"/node/"+node.id, node).then(response => {
            console.log("NODE", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }

    deleteNode(id, nid){
        return axios.delete(this.baseurl+"/graph/"+id+"/node/"+nid).then(response => {
            console.log("node", response)
            // returning the data here allows the caller to get it through another .then(...)
            return this.processGraphs(response.data)
        })
    }


    startProcess(id){
        return axios.get(this.baseurl+"/pipeline/"+id+"/start").then(response => {
            // returning the data here allows the caller to get it through another .then(...)
            return response.data
        })
    }

    stopProcess(id){
        return axios.get(this.baseurl+"/pipeline/"+id+"/stop").then(response => {
            // returning the data here allows the caller to get it through another .then(...)
            return response.data
        })
    }

    getStatus(id){
        return axios.get(this.baseurl+"/pipeline/"+id+"/status").then(response => {
            // returning the data here allows the caller to get it through another .then(...)
            return response.data
        })
    }

    getParams(){
        return axios.get(this.baseurl+"/pipeline/params").then(response => {
            // returning the data here allows the caller to get it through another .then(...)
            return response.data
        })
    }

    getID(){
        return "fc837f44-c866-420b-b786-d9dc54f24478"
    }

}
const Gofi = new GofiAPI()
export {Gofi, Graph }
