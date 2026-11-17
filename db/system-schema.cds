namespace itc.system;
using { cuid, managed } from '@sap/cds/common';


entity System: cuid,managed {
    name: String(50);
    label: String(50);
    url: String(100);
}