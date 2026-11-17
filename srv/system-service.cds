using itc.system as db  from '../db/system-schema';

service SystemService @(requires:'authenticated-user') {

    entity Systems as projection on db.System;

    function connectSystem(system: String) returns LargeString;
}
