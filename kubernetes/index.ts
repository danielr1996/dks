import * as pulumi from "@pulumi/pulumi";
const fs = require('fs');

const stackRef = new pulumi.StackReference(`DanielRichter/dks-virtualization/dev`)

const out: any = stackRef.getOutput('cluster')
const k0sversion = '1.26.2+k0s.1'
const sshkeypath = '~/.ssh/id_ed25519'

out.apply((cluster: any) => {
    fs.writeFileSync('k0sctl.yaml',JSON.stringify({
        apiVersion: "k0sctl.k0sproject.io/v1beta1",
        kind: "Cluster",
        metadata: {
            name:cluster.name
        },
        spec: {
            hosts: [
                ...cluster.controlplane.nodes.map((node:any)=>({...node,role: 'controller+worker'})),
                ...cluster.dataplane.nodes.map((node:any)=>({...node,role: 'worker'})),
            ].map((node:any)=>({
                ssh: {
                    address: node.ipaddress,
                    user: node.username,
                    port: 22, 
                    keyPath: sshkeypath
                },
                role: node.role,
            })),
            k0s:{
                version: k0sversion,
                dynamicConfig: false
            }
        }
    },null,2))
    return ''
})
