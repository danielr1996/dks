import * as k8s from "@pulumi/kubernetes";

new k8s.helm.v3.Release("nginxpublic", {
    chart: "nginx",
    version: "13.2.22",
    namespace: "examples",
    name: 'nginxpublic',
    createNamespace: true,
    repositoryOpts: {
        repo: "https://charts.bitnami.com/bitnami",
    },
    values: {
        ingress: {
            tls: true,
            enabled: true,
            hostname: 'nginx.danielrichter.codes',
            ingressClassName: 'public',
            annotations: {
                "cert-manager.io/cluster-issuer": "letsencrypt-prod"
            }
        }
    }
});
new k8s.helm.v3.Release("nginxprivate", {
    chart: "nginx",
    version: "13.2.22",
    namespace: "examples",
    name: 'nginxprivate',
    createNamespace: true,
    repositoryOpts: {
        repo: "https://charts.bitnami.com/bitnami",
    },
    values: {
        ingress: {
            tls: true,
            enabled: true,
            hostname: 'nginx.dani.rip',
            ingressClassName: 'private',
            annotations: {
                "cert-manager.io/cluster-issuer": "letsencrypt-prod"
            }
        }
    }
});