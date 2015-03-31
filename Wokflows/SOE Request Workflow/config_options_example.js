var config_options = {
    "service_now": {
        "task_id": "task identifier",
        "callback_url": "http url"
    },
    "volumes": [
        {
            "volume_name": "E",
            "size": "50",
            "ext": "ntfs",
            "partitions": [
            {
            "logical_volume_name": "opt",
            "size": 30,
            "mapper_dir": "/opt",
            "volume_group_name": "datadg",
            "ext": "ext4",
            "user": "user",
            "group": "group"
            },
            {
            "logical_volume_name": "optapp",
            "size": 30,
            "mapper_dir": "/opt/app",
            "volume_group_name": "datadg",
            "ext": "ext4",
            "user": "user",
            "group": "group"
            }
            ]
        },
        {
            "volume_name": "F",
            "size": "50",
            "ext": "ntfs"
        }
    ]
};