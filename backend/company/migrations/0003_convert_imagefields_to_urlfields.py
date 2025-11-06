# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_rename_from_portfolio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='skill',
            name='icon',
            field=models.URLField(blank=True, help_text='URL to skill icon image', max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='workexperience',
            name='image',
            field=models.URLField(blank=True, help_text='URL to company/position image', max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='image',
            field=models.URLField(help_text='URL to project image', max_length=500),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='hero_image',
            field=models.URLField(blank=True, help_text='URL to hero image', max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='resume_file',
            field=models.URLField(blank=True, help_text='URL to resume PDF', max_length=500, null=True),
        ),
    ]
