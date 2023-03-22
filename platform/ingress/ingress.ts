import * as k8s from "@pulumi/kubernetes";
import {publicIngressIPAddressPool, privateIngressIPAddressPool, loadbalancer} from '../loadbalancer/loadbalancer'

const ingressNamespace = 'ingress-system'

new k8s.helm.v3.Release("ingress-public", {
    chart: "haproxy-ingress",
    version: "0.14.0",
    namespace: ingressNamespace,
    name: 'ingress-public',
    createNamespace: true,
    repositoryOpts: {
        repo: "https://haproxy-ingress.github.io/charts",
    },
    values: {
        controller:{
            publishService: {
                enabled: true
            },
            ingressClassResource: {
                controllerClass: 'public',
                enabled: true,
                default: false,
            },
            ingressClass: 'public',
            service:{
                annotations: {
                    "metallb.universe.tf/address-pool": publicIngressIPAddressPool.metadata.name
                }
            }
        }
    }
},{dependsOn: loadbalancer});
new k8s.helm.v3.Release("ingress-private", {
    chart: "haproxy-ingress",
    version: "0.14.0",
    namespace: ingressNamespace,
    name: 'ingress-private',
    createNamespace: true,
    repositoryOpts: {
        repo: "https://haproxy-ingress.github.io/charts",
    },
    values: {
        controller:{
            publishService: {
                enabled: true
            },
            ingressClassResource: {
                controllerClass: 'private',
                enabled: true,
                default: false,
            },
            ingressClass: 'private',
            service:{
                annotations: {
                    "metallb.universe.tf/address-pool": privateIngressIPAddressPool.metadata.name
                }
            }
        }
    }
},{dependsOn: loadbalancer});
