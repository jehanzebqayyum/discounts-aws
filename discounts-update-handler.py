
import json, urllib

print('Loading function')


def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    url = "http://search-discounts-b66mp2j5op2utko2iueei4rod4.eu-west-1.es.amazonaws.com/discounts/discount/_bulk"
    headers = {'Content-Type': 'application/x-ndjson'}
    
    payload = ""
    
    for record in event['Records']:
        print(record)
        if record['eventName'] == 'REMOVE':
            payload += "{ \"delete\" : { \"_id\": \"" + record['dynamodb']['Keys']['id']['S']+ "\"} }\n"
        else:
            payload += "{ \"index\" : { \"_id\": \"" + record['dynamodb']['NewImage']['id']['S']+ "\"} }\n"
            payload += "{ "
            for k, v in record['dynamodb']['NewImage'].items():
                if k != "_id":
                    payload += "\"" + k + "\" : \"" + str(v.get('S', v.get('SS', ''))) + "\", "
            payload = payload[:-2]
            payload += " }"
        payload += "\n"
        
    payload += "\n"
    print(payload)
    
    payload = payload.encode("utf8")
    req =  urllib.request.Request(url, data=payload, headers=headers)
    
    try:
        resp = urllib.request.urlopen(req)
        print(resp.read())
    except urllib.error.HTTPError as error:
        print(error.read())
        return 'error'
    
    return 'success'
