# Generated manually - Clear image data before converting fields

from django.db import migrations


def clear_image_fields(apps, schema_editor):
    """Clear all image/file fields before converting to URLField"""
    Skill = apps.get_model('company', 'Skill')
    WorkExperience = apps.get_model('company', 'WorkExperience')
    Project = apps.get_model('company', 'Project')
    SiteSettings = apps.get_model('company', 'SiteSettings')

    # Clear all image fields
    Skill.objects.all().update(icon=None)
    WorkExperience.objects.all().update(image=None)
    Project.objects.all().delete()  # Delete projects as image is required
    SiteSettings.objects.all().update(hero_image=None, resume_file=None)


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_rename_from_portfolio'),
    ]

    operations = [
        migrations.RunPython(clear_image_fields),
    ]
