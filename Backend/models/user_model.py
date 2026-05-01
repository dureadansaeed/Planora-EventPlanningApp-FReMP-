from extensions import mongo

def create_user(user_data):
    return mongo.db.users.insert_one(user_data)

def find_user_by_email(email):
    return mongo.db.users.find_one({"email": email})