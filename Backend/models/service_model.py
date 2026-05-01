from extensions import mongo

def get_all_services():
    services = list(mongo.db.services.find({}))
    for s in services:
        if '_id' in s:
            s['_id'] = str(s['_id'])
    return services