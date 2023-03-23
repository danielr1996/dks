import * as k8s from "@pulumi/kubernetes";
import {credentials} from "../credentials"

const namespace = 'longhorn-system'

const secret = new k8s.core.v1.Secret('longhorn-backup-secret',{
    metadata: {
        name: 'longhorn-backup-secret',
        namespace,
    },
    type: 'Opaque',
    stringData: credentials.storage.credentials
})

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
        },
        defaultSettings: {
            backupTarget: credentials.storage.backupTarget,
            backupTargetCredentialSecret: secret.metadata.name
        }
    }
});

new k8s.apiextensions.CustomResource('snapshotjob', {
    apiVersion: 'longhorn.io/v1beta1',
    kind: 'RecurringJob',
    metadata: {
        name: 'default-hourly-snapshot',
        namespace
    },
    spec: {
        cron: '0 * * * *',
        task: 'snapshot',
        groups: ['default'],
        retain: 3,
        concurrency: 2,
    }
}, {dependsOn: longhorn})

new k8s.apiextensions.CustomResource('backupjob', {
    apiVersion: 'longhorn.io/v1beta1',
    kind: 'RecurringJob',
    metadata: {
        name: 'default-nightly-backup',
        namespace
    },
    spec: {
        // cron: '20 4 * * ?',
        cron: '20 * * * *',
        task: 'backup',
        groups: ['default'],
        retain: 10,
        concurrency: 2,
    }
}, {dependsOn: longhorn})