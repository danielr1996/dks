import * as k8s from "@pulumi/kubernetes";

export const loadbalancer = new k8s.helm.v3.Release("loadbalancer", {
    chart: "metallb",
    version: "4.1.13",
    namespace: 'metallb-system',
    name: 'metallb',
    createNamespace: true,
    repositoryOpts: {
        repo: "https://charts.bitnami.com/bitnami",
    },
});

new k8s.apiextensions.CustomResource('defaultIPAddressPool',{
    apiVersion: 'metallb.io/v1beta1',
    kind: 'IPAddressPool',
    metadata: {
        name: 'default',
        namespace: loadbalancer.namespace,
    },
    spec: {
        addresses: ['10.0.200.0/24'],
        avoidBuggyIPs: true,
    }
},{dependsOn: loadbalancer})

export const publicIngressIPAddressPool = new k8s.apiextensions.CustomResource('publicIngressIPAddressPool',{
    apiVersion: 'metallb.io/v1beta1',
    kind: 'IPAddressPool',
    metadata: {
        name: 'ingress-public',
        namespace: loadbalancer.namespace,
    },
    spec: {
        addresses: ['10.0.204.1/32'],
        autoAssign: false,
    }
},{dependsOn: loadbalancer})

export const privateIngressIPAddressPool = new k8s.apiextensions.CustomResource('privateIngressIPAddressPool',{
    apiVersion: 'metallb.io/v1beta1',
    kind: 'IPAddressPool',
    metadata: {
        name: 'ingress-private',
        namespace: loadbalancer.namespace,
    },
    spec: {
        addresses: ['10.0.204.2/32'],
        autoAssign: false,
    }
},{dependsOn: loadbalancer})


export const l2advertisment = new k8s.apiextensions.CustomResource('l2advertisement',{
    apiVersion: 'metallb.io/v1beta1',
    kind: 'L2Advertisement',
    metadata: {
        name: 'default',
        namespace: loadbalancer.namespace,
    }
},{dependsOn: loadbalancer})
