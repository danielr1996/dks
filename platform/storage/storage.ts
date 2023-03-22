import * as k8s from "@pulumi/kubernetes";

const namespace = 'longhorn-system'
const longhorn = new k8s.helm.v3.Release("storage", {
    chart: "longhorn",
    version: "1.4.0",
    namespace,
    name: 'longhorn',
    createNamespace: true,
    repositoryOpts: {
        repo: "https://charts.longhorn.io",
    },
    values: {
        csi: {
          kubeletRootDir: '/var/lib/k0s/kubelet'
        },
        ingress: {
            enabled: true,
            tls: true,
            ingressClassName: 'private',
            host: 'longhorn.dani.rip',
            tlsSecret: 'longhorn.dani.rip',
            annotations: {
                "cert-manager.io/cluster-issuer": "letsencrypt-prod"
            }
        }
    }
});

new k8s.apiextensions.CustomResource('snapshotjob', {
    apiVersion: 'longhorn.io/v1beta1',
    kind: 'RecurringJob',
    metadata: {
        name: 'default-nightly-snapshot',
        namespace
    },
    spec: {
        cron: '20 4 * * ?',
        task: 'snapshot',
        groups: ['default'],
        retain: 3,
        concurrency: 2,
    }
}, {dependsOn: longhorn})