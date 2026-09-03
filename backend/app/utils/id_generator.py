from datetime import datetime


def generate_animal_id():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"VRD-{timestamp}"