import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi"

const namespace = 'cert-manager'
export const certmanager = new k8s.helm.v3.Release("certmanager", {
    chart: "cert-manager",
    version: "1.10.1",
    namespace,
    name: 'cert-manager',
    createNamespace: true,
    repositoryOpts: {
        repo: "https://charts.jetstack.io",
    },
    values: {
        installCRDs: true,
        extraArgs: [
            '--acme-http01-solver-nameservers=9.9.9.9:53,1.1.1.1:53'
        ]
    }
});

const mail = 'danielrichter@posteo.de'
const solvers = [
    {
        http01: {
            ingress: {
                class: 'public'
            }
        },
    },
]

new k8s.apiextensions.CustomResource('letsencrypt-prod', {
    apiVersion: 'cert-manager.io/v1',
    kind: 'ClusterIssuer',
    metadata: {
        name: 'letsencrypt-prod',
    },
    spec: {
        acme: {
            server: "https://acme-v02.api.letsencrypt.org/directory",
            email: mail,
            privateKeySecretRef: {
                name: "letsencrypt-prod-private-key"
            },
            solvers
        }
    }
}, {dependsOn: certmanager})

new k8s.apiextensions.CustomResource('letsencrypt-staging', {
    apiVersion: 'cert-manager.io/v1',
    kind: 'ClusterIssuer',
    metadata: {
        name: 'letsencrypt-staging',
    },
    spec: {
        acme: {
            server: "https://acme-staging-v02.api.letsencrypt.org/directory",
            email: mail,
            privateKeySecretRef: {
                name: "letsencrypt-staging-private-key"
            },
            solvers
        }
    }
}, {dependsOn: certmanager})
